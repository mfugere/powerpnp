const AWS = require("aws-sdk")
const ddb = new AWS.DynamoDB.DocumentClient()

exports.handler = (event, context, callback) => {
  let username = event.username
  let colName = event.res.toUpperCase() + "S"
  let ref = event.ref || {}
  let operation = event.operation
  let index = event.index || -1

  updateAccount(colName, username, ref, operation, index).then((returnValue) => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(returnValue),
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    })
  }).catch((err) => {
    console.error(err);
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        Error: err.message,
        Reference: context.awsRequestId
      }),
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    })
  })
}

let updateAccount = (colName, username, ref, operation, index) => {
  let params = {
    TableName: "PPNPACCT",
    Key: {
      USERNAME: username
    },
    ExpressionAttributeNames: { "#col": colName },
    ReturnValues: "ALL_NEW"
  }

  if (operation === "create") {
    params.UpdateExpression = "SET #col = list_append(#col, :r)"
    params.ExpressionAttributeValues = { ":r": ref }
  } else if (operation === "update") {
    params.UpdateExpression = "SET #col[" + index + "] = :r"
    params.ExpressionAttributeValues = { ":r": ref }
  } else if (operation === "delete") params.UpdateExpression = "REMOVE #col[" + index + "]"

  return ddb.update(params).promise()
}

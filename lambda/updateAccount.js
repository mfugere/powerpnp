const AWS = require("aws-sdk")
const ddb = new AWS.DynamoDB.DocumentClient()

exports.handler = (event, context, callback) => {
  let username = event.username
  let colName = event.res.toUpperCase() + "S"
  let ref = event.ref

  updateAccount(colName, username, ref).then((returnValue) => {
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

let updateAccount = (colName, username, ref) => {
  return ddb.update({
    TableName: "PPNPACCT",
    Key: {
      USERNAME: username
    },
    UpdateExpression: "SET #col = list_append(#col, :r)",
    ExpressionAttributeNames: { "#col": colName },
    ExpressionAttributeValues: { ":r": ref },
    ReturnValues: "ALL_NEW"
  }).promise()
}

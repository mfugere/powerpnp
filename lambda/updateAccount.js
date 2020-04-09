const AWS = require("aws-sdk")
const ddb = new AWS.DynamoDB.DocumentClient()

exports.handler = (event, context, callback) => {
  const message = JSON.parse(event.Records[0].Sns.Message)
  console.log("Message received from SNS: ", message)
  let colName = message.REF.split("/")[1].toUpperCase() + "S"
  let username = message.USERNAME
  let ref = [{
    REF: message.REF,
    NAME: message.NAME
  }]

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
    ReturnValues: "UPDATED_NEW"
  }).promise()
}

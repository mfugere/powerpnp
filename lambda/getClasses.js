const AWS = require("aws-sdk")

const ddb = new AWS.DynamoDB.DocumentClient()

exports.handler = (event, context, callback) => {
  getClasses().then((result) => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(result),
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

let getClasses = (ref) => {
  return ddb.scan({
    TableName: "PPNPCLSS"
  }).promise()
}

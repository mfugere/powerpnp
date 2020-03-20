const AWS = require("aws-sdk")

const ddb = new AWS.DynamoDB.DocumentClient()

exports.handler = (event, context, callback) => {
  const username = event.queryStringParameters.username

  getAccount(username).then((result) => {
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

let getAccount = (username) => {
  return ddb.get({
    TableName: "PPNPACCT",
    Key: {
      USERNAME: username
    }
  }).promise()
}

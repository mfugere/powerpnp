const AWS = require("aws-sdk")
const crypto = require("crypto")
const ddb = new AWS.DynamoDB.DocumentClient()
const lambda = new AWS.Lambda({ region: "us-east-1" })

exports.handler = (event, context, callback) => {
  const ref = event.pathParameters.ref
  const index = event.queryStringParameters.index
  const username = event.requestContext.authorizer.claims["cognito:username"]

  deleteCharacter(ref).then(() => {
    lambda.invoke({
      FunctionName: "updateAccount",
      Payload: JSON.stringify({
        username: username,
        res: "character",
        operation: "delete",
        index: index
      })
    }, function (err, data) {
      if (err) callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          Error: err.message,
          Reference: context.awsRequestId
        }),
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
      else callback(null, {
        statusCode: 201,
        body: data.Payload,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
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

let deleteCharacter = (ref) => {
  return ddb.delete({
    TableName: "PPNPCHAR",
    Key: {
      REF: ref
    }
  }).promise()
}

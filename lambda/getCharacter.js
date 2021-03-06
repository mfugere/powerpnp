const AWS = require("aws-sdk")

const ddb = new AWS.DynamoDB.DocumentClient()

exports.handler = (event, context, callback) => {
  const ref = event.pathParameters.ref

  getCharacter(ref).then((result) => {
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

let getCharacter = (ref) => {
  return ddb.get({
    TableName: "PPNPCHAR",
    Key: {
      REF: ref
    }
  }).promise()
}

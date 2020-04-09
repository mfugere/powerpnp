const AWS = require("aws-sdk")
const crypto = require("crypto")
const ddb = new AWS.DynamoDB.DocumentClient()

exports.handler = (event, context, callback) => {
  const cname = JSON.parse(event.body).data
  const username = event.requestContext.authorizer.claims["cognito:username"]
  const refId = crypto.randomBytes(10)
  const ref = "/character/" + refId.toString("hex")

  createCharacter(cname, ref, username).then(() => {
    callback(null, {
      statusCode: 201,
      body: JSON.stringify({
        REF: ref,
        NAME: cname
      }),
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

let createCharacter = (cname, ref, username) => {
  return ddb.put({
    TableName: "PPNPCHAR",
    Item: {
      REF: ref,
      NAME: cname,
      RACE: {},
      CLASS: {},
      STATS: {},
      USERNAME: username
    }
  }).promise()
}

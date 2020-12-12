const AWS = require("aws-sdk")
const crypto = require("crypto")
const ddb = new AWS.DynamoDB.DocumentClient()
const lambda = new AWS.Lambda({ region: "us-east-1" })

exports.handler = (event, context, callback) => {
  const cname = JSON.parse(event.body).data
  const username = event.requestContext.authorizer.claims["cognito:username"]
  const refId = crypto.randomBytes(10)
  const ref = refId.toString("hex")

  createCharacter(cname, ref, username).then(() => {
    let newRefs = [{
      REF: "/character/" + ref,
      NAME: cname
    }]
    lambda.invoke({
      FunctionName: "updateAccount",
      Payload: JSON.stringify({
        username: username,
        res: "character",
        ref: newRefs
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

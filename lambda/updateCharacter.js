const AWS = require("aws-sdk")
const crypto = require("crypto")
const ddb = new AWS.DynamoDB.DocumentClient()
const lambda = new AWS.Lambda({ region: "us-east-1" })

exports.handler = (event, context, callback) => {
  const attrs = JSON.parse(event.body)
  const username = event.requestContext.authorizer.claims["cognito:username"]
  const refId = crypto.randomBytes(10)
  const ref = event.pathParameters.ref
  const index = event.queryStringParameters.index

  updateCharacter(attrs, ref, username).then((result) => {
    if (result && (result.NAME !== attrs.NAME)) {
      let newRefs = {
        REF: "/character/" + ref,
        NAME: attrs.NAME,
      }
      lambda.invoke({
        FunctionName: "updateAccount",
        Payload: JSON.stringify({
          username: username,
          res: "character",
          ref: newRefs,
          index: index,
          operation: "update"
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
    }
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

let updateCharacter = (attrs, ref, username) => {
  return ddb.put({
    TableName: "PPNPCHAR",
    Item: {
      REF: ref,
      NAME: attrs.NAME,
      RACE: attrs.RACE,
      CLASS: attrs.CLASS,
      ALIGNMENT: attrs.ALIGNMENT,
      USERNAME: username
    },
    ReturnValues: "ALL_OLD"
  }).promise()
}

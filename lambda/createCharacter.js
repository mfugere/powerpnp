const AWS = require("aws-sdk")
const crypto = require("crypto")
const ddb = new AWS.DynamoDB.DocumentClient()

exports.handler = (event, context, callback) => {
  const cname = JSON.parse(event.body).data
  const username = event.requestContext.authorizer.claims["cognito:username"]
  const refId = crypto.randomBytes(10)
  const ref = "/character/" + refId.toString("hex")

  createCharacter(cname, ref, username).then(() => {
    let newRefs = [{
      REF: ref,
      NAME: cname
    }]
    updateAccount(newRefs, username).then((result) => {
      callback(null, {
        statusCode: 201,
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

let updateAccount = (newRefs, username) => {
  return ddb.update({
    TableName: "PPNPACCT",
    Key: {
      USERNAME: username
    },
    UpdateExpression: "SET #col = list_append(#col, :r)",
    ExpressionAttributeNames: { "#col": "CHARACTERS" },
    ExpressionAttributeValues: { ":r": newRefs },
    ReturnValues: "ALL_NEW"
  }).promise()
}

const randomBytes = require("crypto").randomBytes
const AWS = require("aws-sdk")

const ddb = new AWS.DynamoDB.DocumentClient()

exports.handler = (event, context, callback) => {
  const accountId = toUrlString(randomBytes(16))
  const username = JSON.parse(event.body).data

  createAccount(accountId, username).then(() => {
    callback(null, {
      statusCode: 201,
      body: JSON.stringify({
        ACCT_ID: accountId,
        USERNAME: username,
        GAMES: [],
        CHARACTERS: []
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

let createAccount = (accountId, username) => {
  return ddb.put({
    TableName: "PPNPACCT",
    Item: {
      ACCT_ID: accountId,
      USERNAME: username,
      GAMES: [],
      CHARACTERS: []
    }
  }).promise()
}

let toUrlString = (buffer) => {
  return buffer.toString("base64")
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=/g, "")
}

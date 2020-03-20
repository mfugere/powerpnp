const AWS = require("aws-sdk")

const ddb = new AWS.DynamoDB.DocumentClient()

exports.handler = (event, context, callback) => {
  const username = JSON.parse(event.body).data

  createAccount(username).then(() => {
    callback(null, {
      statusCode: 201,
      body: JSON.stringify({
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

let createAccount = (username) => {
  return ddb.put({
    TableName: "PPNPACCT",
    Item: {
      USERNAME: username,
      GAMES: [],
      CHARACTERS: []
    }
  }).promise()
}

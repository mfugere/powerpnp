const AWS = require("aws-sdk")

const s3 = new AWS.S3()
const bucketArn = "powerpnp-avatars"

exports.handler = (event, context, callback) => {
  const type = event.queryStringParameters.type
  const avatar = JSON.parse(event.body).imgFile

  uploadAvatar(avatar, type).then((result) => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(result),
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    })
  }).catch((err) => {
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

let uploadAvatar = (avatar, type) => {
  return s3.putObject({
    Body: avatar,
    Bucket: bucketArn + "/" + type,
    Key: "Test"
  }).promise()
}

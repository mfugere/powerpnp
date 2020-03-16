const AWS = require("aws-sdk")
const cognitoIdp = new AWS.CognitoIdentityServiceProvider()

exports.handler = async(event, context, callback) => {
  if (event.request.userAttributes.hasOwnProperty("email")) {
    const email = event.request.userAttributes.email
    const userPoolId = event.userPoolId

    return verifyEmail(email, userPoolId).then(results => {
      if (results.Users.length > 0 && results.Users[0].Username !== event.userName) {
        callback(new Error("A user with the same email address exists"), event)
      } else callback(null, event)
    }).catch(error => {
      callback(error, event)
    })
  }
}

let verifyEmail = (email, userPoolId) => {
  const params = {
    UserPoolId: userPoolId,
    Filter: "email = \"" + email + "\""
  }

  return cognitoIdp.listUsers(params).promise()
}

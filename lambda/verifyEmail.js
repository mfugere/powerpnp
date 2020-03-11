const AWS = require("aws-sdk");
const cognitoIdp = new AWS.CognitoIdentityServiceProvider();

exports.handler = async(event, context, callback) => {
    if (event.request.userAttributes.hasOwnProperty("email")) {
        const email = event.request.userAttributes.email;

        const params = {
            UserPoolId: event.userPoolId,
            Filter: "email = \"" + email + "\"",
        };

        return cognitoIdp.listUsers(params).promise()
            .then(results => {
                // if the usernames are the same, dont raise and error here so that
                // cognito will raise the duplicate username error
                if (results.Users.length > 0 && results.Users[0].Username !== event.userName) {
                    callback(Error("A user with the same email address exists"), event);
                }
                callback(null, event);
            })
            .catch(error => {
                callback(error, event);
            });
    }
};

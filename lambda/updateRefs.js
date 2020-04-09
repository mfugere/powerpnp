const AWS = require("aws-sdk")
const sns = new AWS.SNS()
const snsArn = "arn:aws:sns:us-east-1:188511423508:newrefs"

exports.handler = (event, context, callback) => {
  event.Records.forEach((record) => {
    console.log("Stream record: " + JSON.stringify(record, null, 2))

    if (record.eventName === "INSERT") {
      let newStrings = {}
      const updates = record.dynamodb.NewImage
      for (const key in updates) {
        if (updates[key].S) newStrings[key] = updates[key].S
      }
      let params = {
        "Message": JSON.stringify(newStrings),
        "TopicArn": snsArn
      }
      sns.publish(params, (err, data) => {
        if (err) {
          console.error("Unable to send message. Error JSON: ", JSON.stringify(err, null, 2))
        } else {
          console.log("Results from sending message: ", JSON.stringify(data, null, 2))
        }
      })
    }
    callback(null, `Successfully processed ${event.Records.length} records.`)
  })
}

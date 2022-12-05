const axios= require('axios');
const db= require('./db');
const token = process.env.SLACK_BOT_TOKEN;
const config = require('./config.json')

exports.handler = (event, context, callback) => {
    const body = JSON.parse(event.body);
    switch (body.type) {
        case "url_verification": callback(null, body.challenge); break;
        case "event_callback": processRequest(body, callback); break;
       

        default: callback(null);
    }
};

const processRequest = (body, callback) => {
    switch (body.event.type) {
        case "message": processMessages(body, callback); break;
        case "app_mention": processAppMention(body, callback); break;
        default: callback(null);
    }
};

const processMessages = (body, callback) => {
    console.debug("message:", body.event.text);
    callback(null);
};


const processAppMention = (body, callback) => {

    const first = str.split(':')[0];
    const sec="todo-file"
    if (first==sec){
        module.exports.uploadFn = async (event) => {
            const fileToUpload = {
              userId:"123456",
              email:"enrico@gmail.com",
              city:"London",
              country:"UK"
            }
            try {
              const params = {
                  Bucket: config.S3_BUCKET_NAME,
                  Key: `upload-to-s3/${fileToUpload.userId}`,
                  Body: JSON.stringify(fileToUpload),
                  ContentType: 'application/json; charset=utf-8'
              }
              await S3.putObject(params).promise();
              console.log("Upload Completed");
            } catch(e){
              console.log(e)
              console.log("Upload Error", e);
            }
            
          };}

        else{
            const item = body.event.text.split(":").pop().trim();
            db.saveItem(item, (error, result) => {
                if (error !== null) {
                    callback(error)
                } else {
                    const message = {
                        channel: body.event.channel,
                        text: `Item: \`${item}\` is saved to *Amazon DynamoDB*!`
                    };
                    axios({
                        method: 'post',
                        url: 'https://slack.com/api/chat.postMessage',
                        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Authorization': `Bearer ${token}` },
                        data: message
                    })
                        .then((response) => {
                            callback(null);
                        })
                        .catch((error) => {
                            callback("failed to process app_mention");
                        });
                }
            });
        }
    };




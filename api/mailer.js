'use strict';

const async = require('asyncawait/async'), await = require('asyncawait/await');
const AWS=require('aws-sdk')
const nodemailer = require('nodemailer');
var noreply
let ONLINE = process.env['ONLINE'];
let DEBUG = (process.env['DEBUG']==="true") || (ONLINE===undefined);

var init = async(function () {
    return;
    if(noreply) return;
    let smtpConfig= process.env["GMAIL_NOREPLY_CONFIG"]
    if(ONLINE){
    const KMS = new AWS.KMS()
    smtpConfig = JSON.parse(
        await (kms.decrypt({ CiphertextBlob: new Buffer(smtpConfig, 'base64') }).promise())
        .Plaintext.toString('ascii')
        );
    }else{
        smtpConfig=JSON.parse(smtpConfig)
    }

    if(DEBUG) console.log("smtpConfig: ",smtpConfig)

    noreply = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: smtpConfig.client_email,
            serviceClient: smtpConfig.client_id,
            private_key: smtpConfig.private_key,
        }
    });

    if(DEBUG) console.log("noreply: ",noreply)
});

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
module.exports.sendWelcomeEmail = (event,context,callback) => {
    if(DEBUG)console.log(event)
    try{    init();
    }
    catch(err){
        console.log(err)
    }


    // create reusable transporter object using the default SMTP transport

    if(DEBUG)console.log(noreply)

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"JobGet 👻" <noreply@jobget.com>', // sender address
        to: event.email, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
    };
    if(DEBUG)console.log(mailOptions)

    // send mail with defined transport object
    noreply.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        callback(error,info)
    });
    
}
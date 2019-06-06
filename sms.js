/**
 * @module
 * This module deals with SMS functions
 */

// deps
const config = require('config')
const Twilio = require('twilio')

// setup
const smsFromNumber = config.get('twilio.smsFromNumber')
const accountSid = config.get('twilio.accountSid')
const authToken = config.get('twilio.authToken')
const client = new Twilio(accountSid, authToken)

/**
 * takes a number and returns true if it is in E164 format
 * @param {string} num - a number to test for E164 format
 */
function validE164 (num) {
    return /^\+?[1-9]\d{1,14}$/.test(num)
}

/**
 * uses Twilio to send outbound text messages
 * @param {String} textBody - string of text to send via SMS
 * @param {Array} smsToNumbers - array of E164 formatted phone numbers
 */
function sendText (textBody, smsToNumbers) {
    smsToNumbers.map(smsNumber => {
        // console.log(smsNumber);
        if (!validE164(smsNumber)) {
            throw new Error('number must be in E164 format!')
        }

        const textContent = {
            body: textBody,
            to: smsNumber,
            from: smsFromNumber
        }

        client.messages.create(textContent)
            .then((message) => console.log.log(message.to))
    })
}

/**
 * sends an SMS message to a phone number
 * @param {string} phoneNumber - a phone number to send the message to
 * @param {string} msgText - the text string to send to the phone
 */
module.exports.sendSmsMessage = function (phoneNumber, msgText) {
    let phones = []
    phones[0] = phoneNumber
    sendText(msgText, phones)
    console.debug("message: '" + msgText + "' sent to: " + phoneNumber)
}
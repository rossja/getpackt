const config = require('config')
const request = require('request')
const sms = require('./sms')
const toNumbers = config.get('db.toNumbers')

let today = new Date()
let tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
const startDate = today.toISOString().split('T')[0]
const endDate = tomorrow.toISOString().split('T')[0]

const linkUrl = 'https://www.packtpub.com//packt/offers/free-learning'
const serviceUrl = 'https://services.packtpub.com/free-learning-v1/offers?dateFrom=' + startDate + 'T00:00:00.000Z&dateTo=' + endDate + 'T00:00:00.000Z'

request(serviceUrl, processServiceResponse)

function processServiceResponse (err, res, body) {
    if (!err) {
        const jsonData = JSON.parse(body)
        const productNumber = jsonData.data[0].productId
        const summaryUrl = 'https://static.packt-cdn.com/products/' + productNumber + '/summary'
        request(summaryUrl, processSummaryResponse)
    } else {
        console.error('error getting service response: ', err)
    }
}

function processSummaryResponse (err, res, body) {
    if (!err) {
        const jsonData = JSON.parse(body)
        const title = jsonData.title
        const msgText = "Today's free ebook offer is: " + title + '. To get it, go to ' + linkUrl
        console.debug(msgText)
        for (let i = 0; i < toNumbers.length; i++) {
            let phoneNumber = toNumbers[i]
            sms.sendSmsMessage(phoneNumber, msgText)
            console.debug('phone ' + i + ' number is: ' + phoneNumber)
        }
    } else {
        console.error('error getting response: ', err)
    }
}
// app.js

'use strict';

const https = require('https')

var ipApi = "https://freegeoip.app/json/";

const content = function(url) {
    return new Promise((resolve, reject) => {
        const request = https.get(url, (response) => {
            // handle http errors
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load page, status code: ' + response.statusCode));
            }
            // temporary data holder
            const body = [];
            // on every content chunk, push it to the data array
            response.on('data', (chunk) => body.push(chunk));
            // we are done, resolve promise with those joined chunks
            response.on('end', () => resolve(body.join('')));
        });
        // handle connection errors of the request
        request.on('error', (err) => reject(err))
    })
}

index.exports.content = content(url)
    .then(processData)
    .catch((err) => console.error(err))

function processData(data) {
    console.log(data);
    let json = JSON.parse(data);
    return json;
}


console.log('Loading function');

exports.handler = async (event) => {
    // ipAddress either ipv4 or ipv6
    let ipAddress = "";
    let domainFileHash = '';
    let responseCode = 200;
    console.log("request: " + JSON.stringify(event));

    if (event.queryStringParameters && event.queryStringParameters.ipAddress) {
        console.log("Received ipAddress: " + event.queryStringParameters.ipAddress);
        ipAddress = event.queryStringParameters.ipAddress;
    }

    if (event.body) {
        let body = JSON.parse(event.body)
        if (body.domainFileHash) {
            console.log("Received domainFileHash: " + body.domainFileHash);
            domainFileHash = body.domainFileHash;
        }

    }

    let outputMessage = "Neither an ipAddress nor a domainFileHash was provided.";
    let returnMessage = "";

    if (ipAddress) {
        //returnMessage = lookupWhois(ipAddress);
        returnMessage = content(ipApi + ipAddress);
        outputMessage += "\n" + returnMessage;
    } else if (domainFileHash) {
        //returnMessage = lookupWhois(domainFileHash);
        returnMessage = content(ipApi + domainFileHash);
        outputMessage += "\n" + returnMessage;
    }

    let responseBody = {
        message: returnMessage,
        input: event
    };

    let response = {
        statusCode: responseCode,
        headers: {
            "x-custom-header": "my custom header value"
        },
        body: JSON.stringify(responseBody)
    };
    console.log("response: " + JSON.stringify(response))
    return response;
};

module.exports = index;
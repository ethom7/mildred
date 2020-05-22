// index.js

'use strict';

const https = require('https');

let index = {};

var ipApi = "https://freegeoip.app/json/";

exports.handler = async (event) => {
    let ipAddress = "";
    let domainFileHash = '';
    var url = "";

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

    if (ipAddress) {
        url = ipApi + ipAddress;
    } else if (domainFileHash) {
        url = ipApi + domainFileHash;
    }
    return httprequest(url).then((data) => {
        const response = {
            statusCode: 200,
            body: JSON.stringify(data),
        };
        return response;
    });
};

function httprequest(url) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET'
        };
        const req = https.request(url, options, (res) => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }
            var body = [];
            res.on('data', function(chunk) {
                body.push(chunk);
            });
            res.on('end', function() {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch(e) {
                    reject(e);
                }
                resolve(body);
            });
        });
        req.on('error', (e) => {
            reject(e.message);
        });
        // send the request
        req.end();
    });
}


module.exports = index;
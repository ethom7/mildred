'use strict';

// am deciding not to use this to avoid the use of outside libraries
// TODO: maybe remove or leave for future implementation

/* var whois = require('whois')

function lookupWhois(inputString) {
    var returnData = whois.lookup(inputString, function(err, data) {
        console.log(data)
    })
    return returnData;
} */

const https = require('https');

var ipApi = "https://freegeoip.app/json/";

function simpleIPLookup(inputString) {
    let outputData = "";
    var apiUrl = ipApi + inputString;

    var options = {
        method : 'GET'
    }
 
    //making the https get call
    var getReq = https.request(apiUrl, options, function(res) {
        console.log("\nstatus code: ", res.statusCode);
        res.on('data', function(data) {
            console.log( JSON.parse(data) );
            outputData = JSON.parse(data);
        });
    });
 
    //end the request
    getReq.end();
    getReq.on('error', function(err){
        console.log("Error: ", err);
    }); 

    return outputData;
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
        returnMessage = simpleIPLookup(ipAddress);
        outputMessage += "\n" + returnMessage;
    } else if (domainFileHash) {
        //returnMessage = lookupWhois(domainFileHash);
        returnMessage = simpleIPLookup(domainFileHash);
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
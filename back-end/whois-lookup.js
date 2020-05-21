'use strict';

var whois = require('whois')

export function lookupWhois(inputString) {
    var returnData = whois.lookup(inputString, function(err, data) {
        console.log(data)
    })
    return returnData;
}



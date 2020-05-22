// test/test.js

// write unit test, figure out code coverage, get this good

var expect = require("chai").expect;
var index = require("../app.js");

// TODO: create unit test to mock the api request
describe("index", function() {
    describe("simpleIPLookup()", function() {
        it("returns api call from endpoint", function() {
            var google = index.handler('https://freegeoip.app/json/google.com');

            expect(google).to.equal("{\"ip\":\"2a00:1450:4001:824::200e\",\"country_code\":\"DE\",\"country_name\":\"Germany\",\"region_code\":\"HE\",\"region_name\":\"Hesse\",\"city\":\"Frankfurt am Main\",\"zip_code\":\"60313\",\"time_zone\":\"Europe/Berlin\",\"latitude\":50.1188,\"longitude\":8.6843,\"metro_code\":0}");
        });
    })
});

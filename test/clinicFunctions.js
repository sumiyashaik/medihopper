var Clinic = require("../models/clinic");
var chai = require("chai");
var expect = chai.expect;


describe("Clinic", function() {

    var clinic1;
    beforeEach(function() {
        clinic1 = new Clinic({
            name: "Testville Medical Clinic",
            address: "123 Testing Road, Melbourne",
            postcode: "3000",
            phone: "(03) 9999 9999",
            queue: ["dummyuser1", "dummyuser2", "dummyuser3"]
        });
    });

    it("gets the name of the clinic", function() {
        expect(clinic1.clinicName()).to.equal("Testville Medical Clinic");
    });

    it("gets the address of the clinic", function() {
        expect(clinic1.clinicAddress()).to.equal("123 Testing Road, Melbourne");
    });

    it("gets the postcode of the clinic", function() {
        expect(clinic1.clinicPostcode()).to.equal("3000");
    });

    it("gets the phone number of the clinic", function() {
        expect(clinic1.clinicPhone()).to.equal("(03) 9999 9999");
    });

    it("gets the queue count for the clinic", function() {
        expect(clinic1.queueCount()).to.equal(3);
    });

    it("gets the calculated queue wait time for the clinic", function() {
        expect(clinic1.approxWait()).to.equal(3*0.25);
    });

});
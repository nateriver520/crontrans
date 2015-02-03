var chai = chai || require('chai');
var crontrans = typeof CronTrans === 'function' ? new CronTrans() : require('../index');

var expect = chai.expect;

describe("cron translator", function() {

    describe("translate a cron", function() {

        it("give a cron run every 5 min, it should return right message", function() {
            var message = crontrans.translate("*/10 * * * *");
            expect(message.min).to.equal("0,10,20,30,40,50");
        });

        it("give a cron run @21:30, it should return right message", function() {
            var message = crontrans.translate("30 21 * * *");

            expect(message.min).to.equal('30');
            expect(message.hour).to.equal('21');
        });

        it("give a cron run @11:00 from mon to wed @4th of every month, it should return right message", function() {
            var message = crontrans.translate("0 11 4 * mon-wed");

            expect(message.hour).to.equal('11');
            expect(message.min).to.equal('0');
            expect(message.weekday).to.equal('Mon,Tue,Wed');
        });

        it("give a cron run @04:00 @1th of jan, it should return right message", function() {
            var message = crontrans.translate("0 4 1 jan *");

            expect(message.hour).to.equal('4');
            expect(message.min).to.equal('0');
            expect(message.month).to.equal('Jan');
            expect(message.day).to.equal('1');
        });

        it("give a cron run every 15min from 8:00 to 16:00 and 3:00, it should return right message", function() {
            var message = crontrans.translate("*/15 8-16,3 * * *");

            expect(message.min).to.equal('0,15,30,45');
            expect(message.hour).to.equal('8,9,10,11,12,13,14,15,16,3');
        });


    });

});
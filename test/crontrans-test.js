var chai = chai || require('chai');
var crontrans =  typeof CronTrans === 'function' ? new CronTrans() : require('../index')();

var expect = chai.expect;

describe("cron translator", function() {

  describe("translate a cron", function() {

    it("give a cron, it should return right firetime", function() {
        crontrans.translate("****");
    	expect(true).to.equal(true);
    });
  
  });

});

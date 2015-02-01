/*global define*/

!(function (name, definition) {
  // Check define
  var hasDefine = typeof define === 'function',
    // Check exports
    hasExports = typeof module !== 'undefined' && module.exports;

  if (hasDefine) {
    // AMD Module or CMD Module
    define(definition);
  } else if (hasExports) {
    // Node.js Module
    module.exports = definition(require('debug')('crontrans'));
  } else {
    // Assign to common namespaces or simply the global object (window)
    this[name] = definition();
  }
})('CronTrans', function (debug) {
  debug = debug || function () {};


  var CronTrans = function () {
    if (!(this instanceof CronTrans)) {
      return new CronTrans();
    }
  };

  CronTrans.prototype.translate = function (cron) {
    debug('Translate cron : %s', cron);
    return this;
  };

  


  // Backwards compatibility
  CronTrans.CronTrans = CronTrans;

  console.log(CronTrans);
  return CronTrans;
});

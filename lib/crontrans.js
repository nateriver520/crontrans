'use strict';

// global define
!(function(name, definition) {
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
})('CronTrans', function(debug) {
  debug = debug || function() {};


  var CronTrans = function() {
    if (!(this instanceof CronTrans)) {
      return new CronTrans();
    }
  };

  var ALIAS = {
    'month': {
      'jan': 1,
      'feb': 2,
      'mar': 3,
      'apr': 4,
      'may': 5,
      'jun': 6,
      'jul': 7,
      'aug': 8,
      'sep': 9,
      'oct': 10,
      'nov': 11,
      'dec': 12
    },
    'weekday': {
      'sun': 0,
      'mon': 1,
      'tue': 2,
      'wed': 3,
      'thu': 4,
      'fri': 5,
      'sat': 6
    }
  };

  var RANGE = {
    'min': {
      'min': 0,
      'max': 59
    },
    'hour': {
      'min': 0,
      'max': 23
    },
    'day': {
      'min': 1,
      'max': 31
    },
    'month': {
      'min': 1,
      'max': 12
    },
    'weekday': {
      'min': 0,
      'max': 6
    }
  };

  var ATTR = ['min', 'hour', 'day', 'month', 'weekday'];

  var _cron = {}

  CronTrans.prototype.translate = function(cron) {
    debug('Translate cron : %s', cron);

    var vals = cron.split(' ');
    if (vals.length != 5) {
      throw new Error('Invalid cron: ' + cron)
    }

    init();

    for (var i = 0; i < vals.length; i++) {
      parse(vals[i], ATTR[i]);
    }

    return generateMessage();
  };


  var parse = function(val, attr) {
    // any
    if (val === '*') {
      _cron[attr].push('*');
      return;
    }

    var atoms = val.split(',');

    for (var i = 0; i < atoms.length; i++) {
      var atom = atoms[i];

      if (atom.indexOf('-') >= 0) {
        parseRange(atom, attr);
      } else if (atom.indexOf('/') >= 0) {
        parseStep(atom, attr);
      } else
        parseSingle(atom, attr);
    }
  };

  var init = function() {
    for (var i = 0; i < ATTR.length; i++) {
      _cron[ATTR[i]] = [];
    }
  };

  var parseRange = function(atom, attr) {
    var fromto = atom.split('-');
    fromto[0] = aliasToNum(fromto[0], attr);
    fromto[1] = aliasToNum(fromto[1], attr);

    var minmax = RANGE[attr];
    if (!isInInterval(minmax.min, minmax.max, fromto[0]) || fromto[0] > fromto[1] || !isInInterval(minmax.min, minmax.max, fromto[1])) {
      throw new Error(attr + ":" + atom + " should in range " + minmax.min + " - " + minmax.max);
    }

    for (var i = fromto[0]; i <= fromto[1]; i++) {
      _cron[attr].push(i);
    }
  };

  var parseStep = function(atom, attr) {
    var step = parseInt(atom.split('/')[1]);
    var minmax = RANGE[attr];
    for (var i = 0; i < minmax.max; i++) {
      if (i % step == 0) _cron[attr].push(i);
    }
  };

  var parseSingle = function(atom, attr) {
    atom = aliasToNum(atom, attr);
    var minmax = RANGE[attr];
    if (!isInInterval(minmax.min, minmax.max, atom)) {
      throw new Error(attr + ":" + atom + " should in range " + minmax.min + " - " + minmax.max);
    }
    _cron[attr].push(atom);
  };

  var generateMessage = function() {
    var message = {};
    for (var attr in _cron) {
      if (_cron[attr][0] === '*') {
        message[attr] = "any";
        continue;
      }
      message[attr] = _cron[attr].join(",");
    }

    return message;
  };

  var aliasToNum = function(alias, attr) {
    if (isNaN(alias) && attr !== 'month' && attr != 'weekday')
      throw new Error('invalid str:' + alias);
    if (isNaN(alias) && !ALIAS[attr][alias])
      throw new Error('invalid str:' + alias);
    return isNaN(alias) ? ALIAS[attr][alias] : parseInt(alias);
  };

  var isInInterval = function(from, to, check) {
    return check >= from && check <= to;
  };

  var isInArray = function(array, check) {
    return array.indexOf(check) >= 0;
  };

  // Backwards compatibility
  CronTrans.CronTrans = CronTrans;
  return CronTrans;
});
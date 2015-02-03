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
    // skip 0
    'month': [undefined, 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
    'weekday': ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
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
    var message = {
      print: function() {
        var printmsg = [];
        for (var i = 0; i < ATTR.length; i++) {
          var attr = ATTR[i];
          printmsg.push(attr + ": " + this[attr]);
        }
        console.log(printmsg.join('\n'));
      }
    };
    for (var attr in _cron) {
      if (_cron[attr][0] === '*') {
        message[attr] = "any";
        continue;
      }
      message[attr] = pretty(_cron[attr], attr).join(",");
    }

    return message;
  };

  var aliasToNum = function(alias, attr) {
    if (isNaN(alias) && attr !== 'month' && attr !== 'weekday')
      throw new Error('invalid str:' + alias);
    if (isNaN(alias) && ALIAS[attr].indexOf(alias) < 0)
      throw new Error('invalid str:' + alias);
    return isNaN(alias) ? ALIAS[attr].indexOf(alias) : parseInt(alias);
  };

  var isInInterval = function(from, to, check) {
    return check >= from && check <= to;
  };

  var upperFirstCharacter = function(str) {
    return str[0].toUpperCase() + str.substr(1);
  };

  var pretty = function(list, attr) {
    if (attr !== 'month' & attr !== 'weekday')
      return list;

    // just petty month and weekday
    var alias = ALIAS[attr];
    for (var i = 0; i < list.length; i++) {
      list[i] = upperFirstCharacter(alias[list[i]]);
    }
    return list;
  };

  // Backwards compatibility
  CronTrans.CronTrans = CronTrans;
  return CronTrans;
});
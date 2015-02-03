[![Build Status](https://travis-ci.org/nateriver520/crontrans.svg?branch=master)](https://travis-ci.org/nateriver520/crontrans)

# Crontrans

Translate cron expression into natural language.

## Support format

```
*    *    *    *    *    
┬    ┬    ┬    ┬    ┬ 
│    │    │    │    │    
│    │    │    │    │    
│    │    │    │    └───── day of week (0 - 6) (0 is Sun)
│    │    │    └────────── month (1 - 12)
│    │    └─────────────── day of month (1 - 31)
│    └──────────────────── hour (0 - 23)
└───────────────────────── minute (0 - 59)
```

## Setup

### Node

```bash
  npm install crontrans
```

Useage:

```js
  var crontrans = require('crontrans');
```

### Browser

add this to head

Just insert the script tag into HTML page:

```html
  <script src="../lib/crontrans.js"></script>
```

Useage:

```js
  var crontrans = new CronTrans();
```


## Example

```js
	var message = crontrans.translate("0 11 4 * mon-wed");
	/*
		min: 0
		hour: 11
		day: 4
		month: any
		weekday: Mon,Tue,Wed	
	*/

	message = crontrans.translate("*/15 8-16,3 * * *");
	/*
		min: 0,15,30,45
		hour: 8,9,10,11,12,13,14,15,16,3
		day: any
		month: any
		weekday: any
	*/

```

LICENSE
-------------
[MIT](LICENSE)



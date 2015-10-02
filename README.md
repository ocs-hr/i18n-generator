# i18n-generator 

i18n json files generator for node  
This generator is a copy of the i18n-generator from [i18n-generator](https://github.com/huei90/i18n-generator).  
The difference to this repository is that it will generate files with [name].json given name.txt is input and it will generate the in localized named output folders.  

Example:

* output   
 * locale  
      * name.json

## Getting Started

**node.js**  
Install the module with: `npm install -g https://github.com/ocs-hr/i18n-generator`  
Ensure that the path to modules are in your env. 
If not create NODE_PATH to your user variables:  
`NODE_PATH := %USERPROFILE%\AppData\Roaming\npm\node_modules`


```javascript
var i18ng = require('i18n-generator');

var languageFile = 'res/languages/name.txt', outputPath='www/locales';

// js-beautify your json 
i18ng(languageFile, outputPath, true);

// options => https://github.com/beautify-web/js-beautify#options
// splitter support
// | => pipe (default)
// , => csv
// \t => tsv

// get output data api
// input can be file (.txt) or string (data)
i18nGenerator.get(input, 'csv', function (err, data) {
    console.log(data);
    // => output i18n data
});

// or you can
i18nGenerator.get(input, function (err, data) {
	console.log(data);
});
```

## Workflow

**input file name.txt**
```txt
i18n=> | en-GB | nb-NO 
head | head | hode 
=> error 
details | Details: | "Detaljer:"
=> messages
=> connection
connect | Failed to connect to server | Kunne ikke koble til server
failed | Connection failed | Tilkobling mislykktes
<=
close | Close | Lukk 
open | Open | Åpne
```

**output (en-GB/name.json)**
```js
{ "head": "head", "error": { "details": "Details:",	"messages": {	"connection": {	"connect": "Failed to connect to server",	"failed": "Connection failed"	}	}	},	"close": "Close",	"open": "Open"}
```
**output (nb-NO/name.json)**
```js
{ "head": "hode", "error": { "details": "Detaljer:", "messages": { "connection": { "connect": "Kunne ikke koble til server", "failed": "Tilkobling mislykktes" } } }, "close": "Lukk", "open": "Åpne"}
```

**Try Nest**
```
i18n=> | en-GB | nb-NO 
head | head | hode 
=> error 
details | Details: | "Detaljer:"
=> messages
=> connection
connect | Failed to connect to server | Kunne ikke koble til server
failed | Connection failed | Tilkobling mislykktes
<=
close | Close | Lukk 
open | Open | Åpne
```

## License
Copyright (c) 2015 [OCS HR](https://github.com/ocs-hr).  
Licensed under the MIT license.

/*
 * i18n-resouce-generator
 * https://github.com/ocs-hr/i18n-resource-generator
 *
 * Copyright (c) 2015 OCS HR
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Following the 'Node.js require(s) best practices' by
 * https://github.com/zeMirco/node-require-s--best-practices
 *
 * // Nodejs libs
 * var fs = require('fs'),
 *
 * // External libs
 * debug = require('debug'),
 *
 * // Internal libs
 * data = require('./data.js');
 */

var fs = require('fs'),
    beautify = require('js-beautify').js_beautify, module = module || {};

var variableName = {
    i18nGo: 'i18n=>',
    nestStart: '=>',
    nestEnd: '<='
};

var variable = {
    split: '|',
    language: [],
    nestObject: [],
    i18n: {}
};

function resetVariable() {
    variable = {
        split: '|',
        language: [],
        nestObject: [],
        i18n: {}
    };
}

// http://stackoverflow.com/questions/5484673/javascript-how-to-dynamically-create-nested-objects-using-object-names-given-by
function assign(obj, keyPath, value) {
    var lastKeyIndex = keyPath.length - 1;
    for (var i = 0; i < lastKeyIndex; ++i) {
        var key = keyPath[i];
        if (!(key in obj)) {
            obj[key] = {};
        }
        obj = obj[key];
    }
    obj[keyPath[lastKeyIndex]] = value;
}

function magicSplit(data) {
    var output = [],
        index = 0,
        tempString = '',
        isInside = false;
    
    while (data.length) {
        if (data[0] === '"') {
            isInside = !isInside;
            data = data.slice(1, data.length);
            continue;
        } else if (data[0] === '\\' && isInside) {
            tempString += data[1];
            data = data.slice(2, data.length);
            continue;
        } else if (data[0] === variable.split && !isInside) {
            output[index] = tempString;
            tempString = '';
            index++;
            data = data.slice(1, data.length);
            continue;
        }
        
        tempString += data[0];
        data = data.slice(1, data.length);
    }
    
    output[index] = tempString;
    // console.log(output)
    return output;
}

function i18nGenerating(data) {
    
    var output = magicSplit(data);
    // i18n=> (i18nGo)
    if (output[0].indexOf(variableName.i18nGo) !== -1) {
        for (var i = 1; i < output.length; i++) {
            var lang = output[i].trim();
            variable.language.push(lang);
            variable.i18n[lang] = {};
        }
        
        return;
    }
    
    // => (nestStart)
    if (output[0].indexOf(variableName.nestStart) !== -1) {
        variable.nestObject.push(output[0].trim().replace(variableName.nestStart, '').trim());
        return;
    }
    
    // <= (nestEnd)
    if (output[0].indexOf(variableName.nestEnd) !== -1) {
        variable.nestObject = [];
        return;
    }
    
    // generating json object
    for (var j = 1; j < output.length; j++) {
        if (variable.nestObject.length) {
            variable.nestObject.push(output[0].trim());
            if (output[j].trim()) {
                assign(variable.i18n[variable.language[j - 1]], variable.nestObject, output[j].trim());
            }
            variable.nestObject.pop();
        } else if (variable.nestObject.length === 0 && output[j].trim()) {
            variable.i18n[variable.language[j - 1]][output[0].trim()] = output[j].trim();
        }
    }

}

function i18nGenerateAppendHeader(output, outfile) {
    for (var lang in variable.i18n) {
        
        if (!(variable.i18n).hasOwnProperty(lang)) {
            continue;
        }
        var header = "/*\r\n\r\nGenerated file using i18n-resource-generator. Please edit the file " + outfile + ".txt\r\n\r\n*/\r\n";
        var relativePathAndName = output + '/' + lang + '/' + outfile + '.json';
        fs.writeFileSync(relativePathAndName, header, { flag: 'w' });
    }
}

function i18nAppendCrLf(output, outfile) {
    for (var lang in variable.i18n) {
        
        if (!(variable.i18n).hasOwnProperty(lang)) {
            continue;
        }
        var lineEnding = "\r\n";
        var relativePathAndName = output + '/' + lang + '/' + outfile + '.json';
        fs.appendFileSync(relativePathAndName, lineEnding, { flag: 'a' });
    }
}

function i18nFileGenerate(output, options, outfile) {
    
    for (var lang in variable.i18n) {
        var writeText = JSON.stringify(variable.i18n[lang]);
        if (options) {
            writeText = beautify(writeText, options);
        }
        var relativePathAndName = output + '/' + lang + '/' + outfile + '.json';
        fs.appendFileSync(relativePathAndName, writeText, { flag: 'a' });
    }
}

function readFileAndGenerating(input, split) {
    var data;
    
    try {
        data = fs.readFileSync(input);
    } catch (e) {
        data = input;
    }
    
    // reset variable
    resetVariable();
    
    var remaining = '';
    
    // setting up the splitter
    // default is pipe |
    if (!split) {
        split = 'pipe';
    }
    
    switch (split) {
        case 'csv':
            variable.split = ',';
            break;
        case 'tsv':
            variable.split = '\t';
            break;
        case 'pipe':
            variable.split = '|';
            break;
        default:
            variable.split = split;
    }
    
    remaining += data;
    var index = remaining.indexOf('\n');
    var last = 0;
    while (index > -1) {
        var line = remaining.substring(last, index);
        last = index + 1;
        i18nGenerating(line);
        index = remaining.indexOf('\n', last);
    }
    
    remaining = remaining.substring(last);
    
    if (remaining.length > 0) {
        i18nGenerating(remaining);
    }
}

module.exports = function (input, output, options, split) {
    
    
    var isExist = fs.existsSync(output);
    
    if (!isExist) {
        fs.mkdirSync(output);
    }
    
    readFileAndGenerating(input, split);
    
    var struct = input.split("/");
    var outFile = struct[struct.length - 1].replace(/\.[a-zA-Z]{3}/ig, "");
    for (var lang in variable.i18n) {
        var folder = output + "/" + lang;
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
    }
    i18nGenerateAppendHeader(output, outFile);
    i18nFileGenerate(output, options || null, outFile);
    //i18nAppendCrLf(output, outFile);
};

module.exports.get = function (input, split, cb) {
    
    if (typeof split === 'function') {
        cb = split;
        split = 'pipe';
    }
    readFileAndGenerating(input, split);
    
    if (typeof (cb) === "function") {
        cb.call(null, null, variable.i18n);
    }
	
};

/* browser window */
if (typeof window !== 'undefined') {
    // If we're running a web page
    window.i18n = module.exports.get;
}

// basic
// module.exports('test/input.txt', 'test/temp');

// options splitter
// module.exports('test/inputComma.csv', 'test/temp', null, 'csv');

// options splitter tab (\t)
// module.exports('test/inputTab.tsv', 'test/temp', null, 'tab');

// using callback
// module.exports.get('test/input.txt', 'pipe', function (err, data) {console.log(data);});

// using input string data
// module.exports.get('i18n=> | en | zh_TW | de | my\nyou | you | 你 | Du | kamu\nI | I | 我 | ich | Saya\nlove | love | 喜歡 | liebe | cinta\neat | eat | 吃 | essen | makan\nilovegithub | i love github | 我愛 Github | ich liebe Github | Saya cinta pada Github', function (err, data) {console.log(data);});

// (advanced) ignore splitter if " occur
// module.exports('test/inputCommaAdvance.csv', 'test/temp', null, 'csv');
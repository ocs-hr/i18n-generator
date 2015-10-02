'use strict';

var fs = require('fs');
var i18nGenerator = require('./i18n-resource-generator.js');
JSON.minify = JSON.minify || require('./remove-comments.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.i18nGenerator = {
    setUp: function (done) {
        // setup here
        done();
    },
    generate: function (test) {
        test.expect(8);
        
        i18nGenerator('test/input.txt', 'test/temp');
        
        // exists check
        var en = fs.existsSync('./test/temp/en/input.json'),
            de = fs.existsSync('./test/temp/de/input.json'),
            my = fs.existsSync('./test/temp/my/input.json'),
            zh = fs.existsSync('./test/temp/zh_TW/input.json');
        
        test.equal(en, true, 'en/input.json should be generated');
        test.equal(de, true, 'fr/input.json should be generated');
        test.equal(my, true, 'my/input.json should be generated');
        test.equal(zh, true, 'zh/input.json should be generated');
        
        // content check
        var enJson = JSON.minify(fs.readFileSync('./test/temp/en/input.json')),
            deJson = JSON.minify(fs.readFileSync('./test/temp/de/input.json')),
            myJson = JSON.minify(fs.readFileSync('./test/temp/my/input.json')),
            zhJson = JSON.minify(fs.readFileSync('./test/temp/zh_TW/input.json'));
        
        test.equal(enJson, '{"you":"you","I":"I","love":"love","eat":"eat","ilovegithub":"i love github"}', 'en json');
        test.equal(deJson, '{"you":"Du","I":"ich","love":"liebe","eat":"essen","ilovegithub":"ich liebe Github"}', 'de json');
        test.equal(myJson, '{"you":"kamu","I":"Saya","love":"cinta","eat":"makan","ilovegithub":"Saya cinta pada Github"}', 'my json');
        test.equal(zhJson, '{"you":"你","I":"我","love":"喜歡","eat":"吃","ilovegithub":"我愛 Github"}', 'zh_TW json');
        
        test.done();
    },
    optionsSplit: function (test) {
        test.expect(8);
        
        i18nGenerator('test/inputComma.csv', 'test/temp', false, 'csv');
        
        // exists check
        var en = fs.existsSync('./test/temp/en/inputComma.json'),
            de = fs.existsSync('./test/temp/de/inputComma.json'),
            my = fs.existsSync('./test/temp/my/inputComma.json'),
            zh = fs.existsSync('./test/temp/zh_TW/inputComma.json');
        
        test.equal(en, true, 'en/inputComma.json should be generated');
        test.equal(de, true, 'de/inputComma.json should be generated');
        test.equal(my, true, 'my/inputComma.json should be generated');
        test.equal(zh, true, 'zh/inputComma.json should be generated');
        
        // content check
        var enJson = JSON.minify(fs.readFileSync('./test/temp/en/inputComma.json')),
            deJson = JSON.minify(fs.readFileSync('./test/temp/de/inputComma.json')),
            myJson = JSON.minify(fs.readFileSync('./test/temp/my/inputComma.json')),
            zhJson = JSON.minify(fs.readFileSync('./test/temp/zh_TW/inputComma.json'));
        
        test.equal(enJson, '{"you":"you","I":"I","love":"love","eat":"eat","ilovegithub":"i love github"}', 'en json');
        test.equal(deJson, '{"you":"Du","I":"ich","love":"liebe","eat":"essen","ilovegithub":"ich liebe Github"}', 'de json');
        test.equal(myJson, '{"you":"kamu","I":"Saya","love":"cinta","eat":"makan","ilovegithub":"Saya cinta pada Github"}', 'my json');
        test.equal(zhJson, '{"you":"你","I":"我","love":"喜歡","eat":"吃","ilovegithub":"我愛 Github"}', 'zh_TW json');
        
        test.done();
    },
    getMethod: function (test) {
        test.expect(8);
        
        var enObject = { "you": "you", "I": "I", "love": "love", "eat": "eat", "ilovegithub": "i love github" },
            deObject = { "you": "Du", "I": "ich", "love": "liebe", "eat": "essen", "ilovegithub": "ich liebe Github" },
            myObject = { "you": "kamu", "I": "Saya", "love": "cinta", "eat": "makan", "ilovegithub": "Saya cinta pada Github" },
            zhObject = { "you": "你", "I": "我", "love": "喜歡", "eat": "吃", "ilovegithub": "我愛 Github" };
        
        i18nGenerator.get('test/inputComma.csv', 'csv' , function (err, data) {
            test.deepEqual(data.en, enObject, 'en object');
            test.deepEqual(data.de, deObject, 'de object');
            test.deepEqual(data.my, myObject, 'my object');
            test.deepEqual(data.zh_TW, zhObject, 'zh_TW object');
        });
        
        i18nGenerator.get('test/input.txt', function (err, data) {
            test.deepEqual(data.en, enObject, 'en object');
            test.deepEqual(data.de, deObject, 'de object');
            test.deepEqual(data.my, myObject, 'my object');
            test.deepEqual(data.zh_TW, zhObject, 'zh_TW object');
        });
        
        test.done();
    },
    browserify: function (test) {
        test.expect(4);
        
        var input = 'i18n=> | en | zh_TW | de | my\nyou | you | 你 | Du | kamu\nI | I | 我 | ich | Saya\nlove | love | 喜歡 | liebe | cinta\neat | eat | 吃 | essen | makan\nilovegithub | i love github | 我愛 Github | ich liebe Github | Saya cinta pada Github';
        
        var enObject = { "you": "you", "I": "I", "love": "love", "eat": "eat", "ilovegithub": "i love github" },
            deObject = { "you": "Du", "I": "ich", "love": "liebe", "eat": "essen", "ilovegithub": "ich liebe Github" },
            myObject = { "you": "kamu", "I": "Saya", "love": "cinta", "eat": "makan", "ilovegithub": "Saya cinta pada Github" },
            zhObject = { "you": "你", "I": "我", "love": "喜歡", "eat": "吃", "ilovegithub": "我愛 Github" };
        
        i18nGenerator.get(input, 'pipe', function (err, data) {
            test.deepEqual(data.en, enObject, 'en object');
            test.deepEqual(data.de, deObject, 'de object');
            test.deepEqual(data.my, myObject, 'my object');
            test.deepEqual(data.zh_TW, zhObject, 'zh_TW object');
        });
        
        test.done();
    },
    nestObject: function (test) {
        test.expect(8);
        
        i18nGenerator('test/inputNest.txt', 'test/temp');
        
        // exists check
        var en = fs.existsSync('./test/temp/en/inputNest.json'),
            de = fs.existsSync('./test/temp/de/inputNest.json'),
            my = fs.existsSync('./test/temp/my/inputNest.json'),
            zh = fs.existsSync('./test/temp/zh_TW/inputNest.json');
        
        test.equal(en, true, 'en/inputNest.json should be generated');
        test.equal(de, true, 'de/inputNest.json should be generated');
        test.equal(my, true, 'my/inputNest.json should be generated');
        test.equal(zh, true, 'zh/inputNest.json should be generated');
        
        // content check
        var enJson = JSON.minify(fs.readFileSync('./test/temp/en/inputNest.json')),
            deJson = JSON.minify(fs.readFileSync('./test/temp/de/inputNest.json')),
            myJson = JSON.minify(fs.readFileSync('./test/temp/my/inputNest.json')),
            zhJson = JSON.minify(fs.readFileSync('./test/temp/zh_TW/inputNest.json'));
        
        test.equal(enJson, '{"you":"you","I":"I","love":"love","eat":"eat","ilovegithub":"i love github","global":{"sleep":"sleep","morning":"morning","people":{"Ahmad":"Ahmad"}},"Back":"back"}', 'en json');
        test.equal(deJson, '{"you":"Du","I":"ich","love":"liebe","eat":"essen","ilovegithub":"ich liebe Github","global":{"sleep":"schlafen","morning":"Morgen","people":{"Ahmad":"Ahmad"}},"Back":"terug"}', 'de json');
        test.equal(myJson, '{"you":"kamu","I":"Saya","love":"cinta","eat":"makan","ilovegithub":"Saya cinta pada Github","global":{"sleep":"tidur","morning":"pagi","people":{"Ahmad":"Ahmad"}},"Back":"balik"}', 'my json');
        test.equal(zhJson, '{"you":"你","I":"我","love":"喜歡","eat":"吃","ilovegithub":"我愛 Github","global":{"sleep":"睡覺","morning":"早安","people":{"Ahmad":"Ahmad"}},"Back":"回來"}', 'zh_TW json');
        
        test.done();
    },
    nestObjectEmptyKey: function (test) {
        test.expect(8);
        
        i18nGenerator('test/inputNestEmptyKey.txt', 'test/temp');
        
        // exists check
        var en = fs.existsSync('./test/temp/en/inputNestEmptyKey.json'),
            de = fs.existsSync('./test/temp/de/inputNestEmptyKey.json'),
            my = fs.existsSync('./test/temp/my/inputNestEmptyKey.json'),
            zh = fs.existsSync('./test/temp/zh_TW/inputNestEmptyKey.json');
        
        test.equal(en, true, 'en/inputNestEmptyKey.json should be generated');
        test.equal(de, true, 'de/inputNestEmptyKey.json should be generated');
        test.equal(my, true, 'my/inputNestEmptyKey.json should be generated');
        test.equal(zh, true, 'zh/inputNestEmptyKey.json should be generated');
        
        // content check
        var enJson = JSON.minify(fs.readFileSync('./test/temp/en/inputNestEmptyKey.json')),
            deJson = JSON.minify(fs.readFileSync('./test/temp/de/inputNestEmptyKey.json')),
            myJson = JSON.minify(fs.readFileSync('./test/temp/my/inputNestEmptyKey.json')),
            zhJson = JSON.minify(fs.readFileSync('./test/temp/zh_TW/inputNestEmptyKey.json'));
        
        test.equal(enJson, '{"you":"you","I":"I","love":"love","eat":"eat","ilovegithub":"i love github","global":{"sleep":"sleep","morning":"morning"},"Back":"back"}', 'en json');
        test.equal(deJson, '{"you":"Du","I":"ich","love":"liebe","eat":"essen","ilovegithub":"ich liebe Github","global":{"sleep":"schlafen","morning":"Morgen","people":{"Ahmad":"Ahmad"}},"Back":"terug"}', 'de json');
        test.equal(myJson, '{"I":"Saya","eat":"makan","ilovegithub":"Saya cinta pada Github","global":{"sleep":"tidur","morning":"pagi","people":{"Ahmad":"Ahmad"}},"Back":"balik"}', 'my json');
        test.equal(zhJson, '{"you":"你","I":"我","love":"喜歡","eat":"吃","ilovegithub":"我愛 Github","global":{"sleep":"睡覺","morning":"早安","people":{"Ahmad":"Ahmad"}},"Back":"回來"}', 'zh_TW json');
        
        test.done();
    },
    tsvSplitter: function (test) {
        test.expect(8);
        
        i18nGenerator('test/inputTab.tsv', 'test/temp', false, 'tsv');
        
        // exists check
        var en = fs.existsSync('./test/temp/en/inputTab.json'),
            de = fs.existsSync('./test/temp/de/inputTab.json'),
            my = fs.existsSync('./test/temp/my/inputTab.json'),
            zh = fs.existsSync('./test/temp/zh_TW/inputTab.json');
        
        test.equal(en, true, 'en/inputTab.json should be generated');
        test.equal(de, true, 'de/inputTab.json should be generated');
        test.equal(my, true, 'my/inputTab.json should be generated');
        test.equal(zh, true, 'zh/inputTab.json should be generated');
        
        // content check
        var enJson = JSON.minify(fs.readFileSync('./test/temp/en/inputTab.json')),
            deJson = JSON.minify(fs.readFileSync('./test/temp/de/inputTab.json')),
            myJson = JSON.minify(fs.readFileSync('./test/temp/my/inputTab.json')),
            zhJson = JSON.minify(fs.readFileSync('./test/temp/zh_TW/inputTab.json'));
        
        test.equal(enJson, '{"you":"you","I":"I","love":"love","eat":"eat","ilovegithub":"i love github"}', 'en json');
        test.equal(deJson, '{"you":"Du","I":"ich","love":"liebe","eat":"essen","ilovegithub":"ich liebe Github"}', 'de json');
        test.equal(myJson, '{"you":"kamu","I":"Saya","love":"cinta","eat":"makan","ilovegithub":"Saya cinta pada Github"}', 'my json');
        test.equal(zhJson, '{"you":"你","I":"我","love":"喜歡","eat":"吃","ilovegithub":"我愛 Github"}', 'zh_TW json');
        
        test.done();
    },
    commaAdvance: function (test) {
        test.expect(8);
        
        i18nGenerator('test/inputCommaAdvance.csv', 'test/temp', false, 'csv');
        
        // exists check
        var en = fs.existsSync('./test/temp/en/inputCommaAdvance.json'),
            de = fs.existsSync('./test/temp/de/inputCommaAdvance.json'),
            my = fs.existsSync('./test/temp/my/inputCommaAdvance.json'),
            zh = fs.existsSync('./test/temp/zh_TW/inputCommaAdvance.json');
        
        test.equal(en, true, 'en/inputCommaAdvance.json should be generated');
        test.equal(de, true, 'de/inputCommaAdvance.json should be generated');
        test.equal(my, true, 'my/inputCommaAdvance.json should be generated');
        test.equal(zh, true, 'zh/inputCommaAdvance.json should be generated');
        
        // content check
        var enJson = JSON.minify(fs.readFileSync('./test/temp/en/inputCommaAdvance.json')),
            deJson = JSON.minify(fs.readFileSync('./test/temp/de/inputCommaAdvance.json')),
            myJson = JSON.minify(fs.readFileSync('./test/temp/my/inputCommaAdvance.json')),
            zhJson = JSON.minify(fs.readFileSync('./test/temp/zh_TW/inputCommaAdvance.json'));
        
        test.equal(enJson, '{"ilovegithub":"i love github but u"}', 'en json');
        test.equal(deJson, '{"ilovegithub":"was du gesagt"}', 'de json');
        test.equal(myJson, '{"ilovegithub":"saya pun"}', 'my json');
        test.equal(zhJson, '{"ilovegithub":"我愛 github,但我也愛 git"}', 'zh_TW json');
        
        test.done();
    }
};

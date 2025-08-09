import langs, { all, codes, names, has, where } from '../index.js';
import { assert } from 'chai';

suite('langs:', function () {
    let data = {};
    let eng = {};
    let kor = {};

    setup(function () {
        data = require('../data.js');
        eng = data[40];
        kor = data[85];
    });

    test('`langs` is an object', function () {
        assert.isObject(langs);
    });

    suite('all:', function () {
        test('`langs.all` is a function', function () {
            assert.isFunction(all);
        });

        test('`langs.all()` contains `{"name":"English", "local":"English", "1":"en", "2":"eng", "2T":"eng", "2B":"eng", "3":"eng"}`', function () {
            assert.notEqual(all().indexOf(eng), -1);
        });

        test('`langs.all()` contains `{"name":"Korean", "local":"한국어", "1":"ko", "2":"kor", "2T":"kor", "2B":"kor", "3":"kor"}`', function () {
            assert.notEqual(all().indexOf(kor), -1);
        });

        test('`langs.all()` doesn\'t contain `{}`', function () {
            assert.equal(all().indexOf({}), -1);
        });
    });

    suite('codes:', function () {
        test('`langs.codes` is a function', function () {
            assert.isFunction(codes);
        });

        test('`langs.codes("1")` contains "en"', function () {
            assert.notEqual(codes("1").indexOf("en"), -1);
        });

        test('`langs.codes("2")` contains "eng"', function () {
            assert.notEqual(codes("2").indexOf("eng"), -1);
        });

        test('`langs.codes("2T")` contains "eng"', function () {
            assert.notEqual(codes("2T").indexOf("eng"), -1);
        });

        test('`langs.codes("2B")` contains "eng"', function () {
            assert.notEqual(codes("2B").indexOf("eng"), -1);
        });

        test('`langs.codes("3")` contains "eng"', function () {
            assert.notEqual(codes("3").indexOf("eng"), -1);
        });

        test('`langs.codes(1)` contains "en"', function () {
            assert.notEqual(codes(1).indexOf("en"), -1);
        });

        test('`langs.codes(2)` contains "eng"', function () {
            assert.notEqual(codes(2).indexOf("eng"), -1);
        });

        test('`langs.codes(3)` contains "eng"', function () {
            assert.notEqual(codes(3).indexOf("eng"), -1);
        });

        test('`langs.codes("1")` contains "ko"', function () {
            assert.notEqual(codes("1").indexOf("ko"), -1);
        });

        test('`langs.codes("2")` contains "kor"', function () {
            assert.notEqual(codes("2").indexOf("kor"), -1);
        });

        test('`langs.codes("2T")` contains "kor"', function () {
            assert.notEqual(codes("2T").indexOf("kor"), -1);
        });

        test('`langs.codes("2B")` contains "kor"', function () {
            assert.notEqual(codes("2B").indexOf("kor"), -1);
        });

        test('`langs.codes("3")` contains "kor"', function () {
            assert.notEqual(codes("3").indexOf("kor"), -1);
        });

        test('`langs.codes(1)` contains "ko"', function () {
            assert.notEqual(codes(1).indexOf("ko"), -1);
        });

        test('`langs.codes(2)` contains "kor"', function () {
            assert.notEqual(codes(2).indexOf("kor"), -1);
        });

        test('`langs.codes(3)` contains "kor"', function () {
            assert.notEqual(codes(3).indexOf("kor"), -1);
        });

        test('`langs.codes("1")` doesn\'t contain "zz"', function () {
            assert.equal(codes("1").indexOf("zz"), -1);
        });

        test('`langs.codes("2")` doesn\'t contain "zzz"', function () {
            assert.equal(codes("2").indexOf("zzz"), -1);
        });

        test('`langs.codes("2T")` doesn\'t contain "zzz"', function () {
            assert.equal(codes("2T").indexOf("zzz"), -1);
        });

        test('`langs.codes("2B")` doesn\'t contain "zzz"', function () {
            assert.equal(codes("2B").indexOf("zzz"), -1);
        });

        test('`langs.codes("3")` doesn\'t contain "zzz"', function () {
            assert.equal(codes("3").indexOf("zzz"), -1);
        });

        test('`langs.codes(1)` doesn\'t contain "zz"', function () {
            assert.equal(codes(1).indexOf("zz"), -1);
        });

        test('`langs.codes(2)` doesn\'t contain "zzz"', function () {
            assert.equal(codes(2).indexOf("zzz"), -1);
        });

        test('`langs.codes(3)` doesn\'t contain "zzz"', function () {
            assert.equal(codes(3).indexOf("zzz"), -1);
        });

        test('`langs.codes("foo")` is undefined', function () {
            assert.isUndefined(codes("foo"));
        });
    });

    suite('names:', function () {
        test('`langs.names` is a function', function () {
            assert.isFunction(names);
        });

        test('`langs.names()` contains "English"', function () {
            assert.notEqual(names().indexOf("English"), -1);
        });

        test('`langs.names(true)` contains "English"', function () {
            assert.notEqual(names(true).indexOf("English"), -1);
        });

        test('`langs.names()` contains "Korean"', function () {
            assert.notEqual(names().indexOf("Korean"), -1);
        });

        test('`langs.names(true)` contains "한국어"', function () {
            assert.notEqual(names(true).indexOf("한국어"), -1);
        });

        test('`langs.names()` doesn\'t contain "Geordie"', function () {
            assert.equal(names().indexOf("Geordie"), -1);
        });

        test('`langs.names(true)` doesn\'t contain "Geordie"', function () {
            assert.equal(names(true).indexOf("Geordie"), -1);
        });
    });

    suite('has:', function () {
        test('`langs.has` is a function', function () {
            assert.isFunction(has);
        });

        test('`langs.has("name", "English")` is `true`', function () {
            assert.isTrue(has("name", "English"), eng);
        });

        test('`langs.has("local", "English")` is `true`', function () {
            assert.isTrue(has("local", "English"), eng);
        });

        test('`langs.has("1", "en")` is `true`', function () {
            assert.isTrue(has("1", "en"), eng);
        });

        test('`langs.has("2", "eng")` is `true`', function () {
            assert.isTrue(has("2", "eng"), eng);
        });

        test('`langs.has("2T", "eng")` is `true`', function () {
            assert.isTrue(has("2T", "eng"), eng);
        });

        test('`langs.has("2B", "eng")` is `true`', function () {
            assert.isTrue(has("2B", "eng"), eng);
        });

        test('`langs.has("3", "eng")` is `true`', function () {
            assert.isTrue(has("3", "eng"), eng);
        });

        test('`langs.has(1, "en")` is `true`', function () {
            assert.isTrue(has(1, "en"), eng);
        });

        test('`langs.has(2, "eng")` is `true`', function () {
            assert.isTrue(has(2, "eng"), eng);
        });

        test('`langs.has(3, "eng")` is `true`', function () {
            assert.isTrue(has(3, "eng"), eng);
        });

        test('`langs.has("name", "Korean")` is `true`', function () {
            assert.isTrue(has("name", "Korean"), kor);
        });

        test('`langs.has("local", "한국어")` is `true`', function () {
            assert.isTrue(has("local", "한국어"), kor);
        });

        test('`langs.has("1", "ko")` is `true`', function () {
            assert.isTrue(has("1", "ko"), kor);
        });

        test('`langs.has("2", "kor")` is `true`', function () {
            assert.isTrue(has("2", "kor"), kor);
        });

        test('`langs.has("2T", "kor")` is `true`', function () {
            assert.isTrue(has("2T", "kor"), kor);
        });

        test('`langs.has("2B", "kor")` is `true`', function () {
            assert.isTrue(has("2B", "kor"), kor);
        });

        test('`langs.has("3", "kor")` is `true`', function () {
            assert.isTrue(has("3", "kor"), kor);
        });

        test('`langs.has("name", "Geordie")` is `false`', function () {
            assert.isFalse(has("name", "Geordie"));
        });

        test('`langs.has("local", "Geordie")` is `false`', function () {
            assert.isFalse(has("local", "Geordie"));
        });

        test('`langs.has("1", "zz")` is `false`', function () {
            assert.isFalse(has("1", "zz"));
        });

        test('`langs.has("2", "zzz")` is `false`', function () {
            assert.isFalse(has("2", "zzz"));
        });

        test('`langs.has("2T", "zzz")` is `false`', function () {
            assert.isFalse(has("2T", "zzz"));
        });

        test('`langs.has("2B", "zzz")` is `false`', function () {
            assert.isFalse(has("2B", "zzz"));
        });

        test('`langs.has("3", "zzz")` is `false`', function () {
            assert.isFalse(has("3", "zzz"));
        });

        test('`langs.has("foo", "eng")` is `false`', function () {
            assert.isFalse(has("foo", "eng"));
        });
});

    suite('where:', function () {
        test('`langs.where` is a function', function () {
            assert.isFunction(where);
        });

        test('`langs.where("name", "English")` is `{"name":"English", "local":"English", "1":"en", "2":"eng", "2T":"eng", "2B":"eng", "3":"eng"}`', function () {
            assert.strictEqual(where("name", "English"), eng);
        });

        test('`langs.where("local", "English")` is `{"name":"English", "local":"English", "1":"en", "2":"eng", "2T":"eng", "2B":"eng", "3":"eng"}`', function () {
            assert.strictEqual(where("local", "English"), eng);
        });

        test('`langs.where("1", "en")` is `{"name":"English", "local":"English", "1":"en", "2":"eng", "2T":"eng", "2B":"eng", "3":"eng"}`', function () {
            assert.strictEqual(where("1", "en"), eng);
        });

        test('`langs.where("2", "eng")` is `{"name":"English", "local":"English", "1":"en", "2":"eng", "2T":"eng", "2B":"eng", "3":"eng"}`', function () {
            assert.strictEqual(where("2", "eng"), eng);
        });

        test('`langs.where("2T", "eng")` is `{"name":"English", "local":"English", "1":"en", "2":"eng", "2T":"eng", "2B":"eng", "3":"eng"}`', function () {
            assert.strictEqual(where("2T", "eng"), eng);
        });

        test('`langs.where("2B", "eng")` is `{"name":"English", "local":"English", "1":"en", "2":"eng", "2T":"eng", "2B":"eng", "3":"eng"}`', function () {
            assert.strictEqual(where("2B", "eng"), eng);
        });

        test('`langs.where("3", "eng")` is `{"name":"English", "local":"English", "1":"en", "2":"eng", "2T":"eng", "2B":"eng", "3":"eng"}`', function () {
            assert.strictEqual(where("3", "eng"), eng);
        });

        test('`langs.where(1, "en")` is `{"name":"English", "local":"English", "1":"en", "2":"eng", "2T":"eng", "2B":"eng", "3":"eng"}`', function () {
            assert.strictEqual(where(1, "en"), eng);
        });

        test('`langs.where(2, "eng")` is `{"name":"English", "local":"English", "1":"en", "2":"eng", "2T":"eng", "2B":"eng", "3":"eng"}`', function () {
            assert.strictEqual(where(2, "eng"), eng);
        });

        test('`langs.where(3, "eng")` is `{"name":"English", "local":"English", "1":"en", "2":"eng", "2T":"eng", "2B":"eng", "3":"eng"}`', function () {
            assert.strictEqual(where(3, "eng"), eng);
        });

        test('`langs.where("name", "Korean")` is `{"name":"Korean", "local":"한국어", "1":"ko", "2":"kor", "2T":"kor", "2B":"kor", "3":"kor"}`', function () {
            assert.strictEqual(where("name", "Korean"), kor);
        });

        test('`langs.where("local", "한국어")` is `{"name":"Korean", "local":"한국어", "1":"ko", "2":"kor", "2T":"kor", "2B":"kor", "3":"kor"}`', function () {
            assert.strictEqual(where("local", "한국어"), kor);
        });

        test('`langs.where("1", "ko")` is `{"name":"Korean", "local":"한국어", "1":"ko", "2":"kor", "2T":"kor", "2B":"kor", "3":"kor"}`', function () {
            assert.strictEqual(where("1", "ko"), kor);
        });

        test('`langs.where("2", "kor")` is `{"name":"Korean", "local":"한국어", "1":"ko", "2":"kor", "2T":"kor", "2B":"kor", "3":"kor"}`', function () {
            assert.strictEqual(where("2", "kor"), kor);
        });

        test('`langs.where("2T", "kor")` is `{"name":"Korean", "local":"한국어", "1":"ko", "2":"kor", "2T":"kor", "2B":"kor", "3":"kor"}`', function () {
            assert.strictEqual(where("2T", "kor"), kor);
        });

        test('`langs.where("2B", "kor")` is `{"name":"Korean", "local":"한국어", "1":"ko", "2":"kor", "2T":"kor", "2B":"kor", "3":"kor"}`', function () {
            assert.strictEqual(where("2B", "kor"), kor);
        });

        test('`langs.where("3", "kor")` is `{"name":"Korean", "local":"한국어", "1":"ko", "2":"kor", "2T":"kor", "2B":"kor", "3":"kor"}`', function () {
            assert.strictEqual(where("3", "kor"), kor);
        });

        test('`langs.where(1, "ko")` is `{"name":"Korean", "local":"한국어", "1":"ko", "2":"kor", "2T":"kor", "2B":"kor", "3":"kor"}`', function () {
            assert.strictEqual(where(1, "ko"), kor);
        });

        test('`langs.where(2, "kor")` is `{"name":"Korean", "local":"한국어", "1":"ko", "2":"kor", "2T":"kor", "2B":"kor", "3":"kor"}`', function () {
            assert.strictEqual(where(2, "kor"), kor);
        });

        test('`langs.where(3, "kor")` is `{"name":"Korean", "local":"한국어", "1":"ko", "2":"kor", "2T":"kor", "2B":"kor", "3":"kor"}`', function () {
            assert.strictEqual(where(3, "kor"), kor);
        });

        test('`langs.where("name", "Geordie")` is undefined', function () {
            assert.isUndefined(where("name", "Geordie"));
        });

        test('`langs.where("local", "Geordie")` is undefined', function () {
            assert.isUndefined(where("local", "Geordie"));
        });

        test('`langs.where("1", "zz")` is undefined', function () {
            assert.isUndefined(where("1", "zz"));
        });

        test('`langs.where("2", "zzz")` is undefined', function () {
            assert.isUndefined(where("2", "zzz"));
        });

        test('`langs.where("2T", "zzz")` is undefined', function () {
            assert.isUndefined(where("2T", "zzz"));
        });

        test('`langs.where("2B", "zzz")` is undefined', function () {
            assert.isUndefined(where("2B", "zzz"));
        });

        test('`langs.where("3", "zzz")` is undefined', function () {
            assert.isUndefined(where("3", "zzz"));
        });

        test('`langs.where(1, "zz")` is undefined', function () {
            assert.isUndefined(where(1, "zz"));
        });

        test('`langs.where(2, "zzz")` is undefined', function () {
            assert.isUndefined(where(2, "zzz"));
        });

        test('`langs.where(3, "zzz")` is undefined', function () {
            assert.isUndefined(where(3, "zzz"));
        });

        test('`langs.where("foo", "eng")` is undefined', function () {
            assert.isUndefined(where("foo", "eng"));
        });
    });
});

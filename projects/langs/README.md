# Langs

[![MIT Licensed][ico-license]][license]

This library provides ISO 639-1/2/3 language codes with English and local
names. It can be installed from npm registry orignally from the [source](https://github.com/adlawson/nodejs-langs), but in this project it locally installed with yarn package manager.

## Difference between original package and this package

- use newer JavaScript, Node.js grammer, but compatible with @types/langs package.
- update dev dependecies for test

## What's with all the ISO version numbers?
ISO 639 is broken up into many different parts, each either defining language
codes or defining standards for codes in later versions. The ones included in
this library are:
 - `ISO 639-1` 2 characters, one per language or [ISO 639 macrolanguage][wiki-macro]
 - `ISO 639-2/2T` 3 characters, one per language
 - `ISO 639-2B` 3 characters, mostly the same as `639-2T` but with some derived from their English name rather than local name
 - `ISO 639-3` 3 characters, mostly the same as `639-2T` but using the canonical ISO 639 macrolanguage code

The macrolanguages described above cover cases where a language is considered
to be a dialect of another in some standards but not in others, e.g Standard
Arabic `arb` and Arabic `ara`. There's more information on the
[Wikipedia page][wiki-macro].

## Documentation
```js
import { all, names, codes, where, has } from 'langs';

all();
// [
//     {"name":"English", "local":"English", "1":"en", "2":"eng", "2T":"eng", "2B":"eng", "3":"eng"},
//     {"name":"Korean", "local":"한국어", "1":"ko", "2":"kor", "2T":"kor", "2B":"kor", "3":"kor"},
//     ...
// ]

names();
// [
//     "English",
//     "Korean",
//     ...
// ]

names(true);
// [
//     "English",
//     "한국어",
//     ...
// ]

codes("1");
// [
//     "en",
//     "ko",
//     ...
// ]

codes("2T" /*same as "2"*/);
// [
//     "eng",
//     "kor",
//     ...
// ]

codes("2B");
// [
//     "eng",
//     "kor",
//     ...
// ]

codes("3");
// [
//     "eng",
//     "kor",
//     ...
// ]

where("name", "Korean");
// {"name":"Korean", "local":"한국어", "1":"ko", "2":"kor", "2T":"kor", "2B":"kor", "3":"kor"}

where("local", "한국어, 조선어");
// {"name":"Korean", "local":"한국어", "1":"ko", "2":"kor", "2T":"kor", "2B":"kor", "3":"kor"}

where("1", "ko");
// {"name":"Korean", "local":"한국어", "1":"ko", "2":"kor", "2T":"kor", "2B":"kor", "3":"kor"}

where("2", "kor");
// {"name":"Korean", "local":"한국어", "1":"ko", "2":"kor", "2T":"kor", "2B":"kor", "3":"kor"}

where("2T", "kor");
// {"name":"Korean", "local":"한국어", "1":"ko", "2":"kor", "2T":"kor", "2B":"kor", "3":"kor"}

where("2B", "kor");
// {"name":"Korean", "local":"한국어", "1":"ko", "2":"kor", "2T":"kor", "2B":"kor", "3":"kor"}

where("3", "kor");
// {"name":"Korean", "local":"한국어", "1":"ko", "2":"kor", "2T":"kor", "2B":"kor", "3":"kor"}

has("name", "Korean");
// true

has("local", "한국어, 조선어");
// true

has("1", "ko");
// true

has("2", "kor");
// true

has("2T", "kor");
// true

has("2B", "kor");
// true

has("3", "kor");
// true

has("name", "Geordie");
// false

has("high", "fives");
// false
```

### License
The content of this library is originally released under the **MIT License** by
**Andrew Lawson**.<br/> You can find a copy of this license in
[`LICENSE`][license] or at http://www.opensource.org/licenses/mit.

<!-- Links -->
[npm]: https://npmjs.org/package/langs
[travis]: https://travis-ci.org/adlawson/nodejs-langs
[ico-license]: http://img.shields.io/npm/l/langs.svg?style=flat
[ico-package]: http://img.shields.io/npm/v/langs.svg?style=flat
[ico-build]: http://img.shields.io/travis/adlawson/nodejs-langs/master.svg?style=flat
[license]: /LICENSE
[wiki]: http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
[wiki-macro]: http://en.wikipedia.org/wiki/ISO_639_macrolanguage

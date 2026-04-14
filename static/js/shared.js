'use strict';

const {inlineAttribute} = require('ep_plugin_helpers/attributes');

const range = (b, e, s = 1) => [...Array(Math.ceil((e - b) / s)).keys()].map((x) => (x * s) + b);

const sizes = []
    .concat(range(8, 20))
    .concat(range(20, 30, 2))
    .concat(range(30, 50, 5))
    .concat(range(50, 70, 10));

const fontSize = inlineAttribute({attr: 'font-size'});

exports.collectContentPre = fontSize.collectContentPre;
exports.sizes = sizes;

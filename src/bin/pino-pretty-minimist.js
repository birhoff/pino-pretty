#! /usr/bin/env node
import pretty from "../lib/minimist";

if (arg('-h') || arg('--help')) {
    usage().pipe(process.stdout);
} else if (arg('-v') || arg('--version')) {
    /*eslint-disable no-console */
    console.log(require('../../package.json').version);
} else {
    process.stdin.pipe(pretty({
        timeTransOnly: arg('-t'),
        levelFirst: arg('-l')
    })).pipe(process.stdout);
}

function usage() {
    return require('fs')
        .createReadStream(require('path').join(__dirname, 'usage.txt'));
}

function arg(s) {
    return !!~process.argv.indexOf(s);
}

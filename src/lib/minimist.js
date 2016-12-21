import split from "split2";
import Parse from "fast-json-parse";
import chalk from "chalk";

const levels = {
    60: 'FATAL',
    50: 'ERROR',
    40: 'WARN',
    30: 'INFO',
    20: 'DEBUG',
    10: 'TRACE'
};

const standardKeys = [
    'req',
    'res',
    'pid',
    'hostname',
    'name',
    'level',
    'msg',
    'time',
    'v',
    'responseTime'
];

function withSpaces(value) {
    const lines = value.split('\n');
    for (let i = 1; i < lines.length; i++) {
        lines[i] = '    ' + lines[i];
    }
    return lines.join('\n');
}

function filter(value) {
    const keys = Object.keys(value);
    let result = '';

    for (let i = 0; i < keys.length; i++) {
        if (standardKeys.indexOf(keys[i]) < 0) {
            result += '    ' + keys[i] + ': ' + withSpaces(JSON.stringify(value[keys[i]], null, 2)) + '\n';
        }
    }

    return result;
}

function isPinoLine(line) {
    return line.hasOwnProperty('hostname') && line.hasOwnProperty('pid') && (line.hasOwnProperty('v') && line.v === 1);
}

function pretty(opts) {
    const timeTransOnly = opts && opts.timeTransOnly;
    const formatter = opts && opts.formatter;

    const stream = split(mapLine);
    let ctx;
    let levelColors;

    const pipe = stream.pipe;

    stream.pipe = function(dest, opts) {
        ctx = new chalk.constructor({
            enabled: !!(chalk.supportsColor && dest.isTTY)
        });

        levelColors = {
            60: ctx.bgRed,
            50: ctx.red,
            40: ctx.yellow,
            30: ctx.green,
            20: ctx.blue,
            10: ctx.grey
        };

        pipe.call(stream, dest, opts);
    };
    return stream;

    function mapLine(line) {
        const parsed = new Parse(line);
        const value = parsed.value;

        if (parsed.err || !isPinoLine(value)) {
            // pass through
            return line + '\n';
        }

        if (formatter) {
            return opts.formatter(parsed.value) + '\n';
        }

        if (timeTransOnly) {
            value.time = asISODate(value.time);
            return JSON.stringify(value) + '\n';
        }

        line = `[${asISODate(value.time)}] ${asColoredLevel(value)}`;

        if (value.name) {
            line += ' (';
            line += value.name + '/';
            line += ')';
        }
        line += ': ';
        if (value.msg) {
            line += ctx.cyan(value.msg);
        }
        line += '\n';
        if (value.type === 'Error') {
            line += '    ' + withSpaces(value.stack) + '\n';
        } else {
            line += filter(value);
        }
        return line;
    }

    function asISODate(time) {
        return require('moment')(time).format('h:mm:ss:SSS');
    }

    function asColoredLevel(value) {
        return levelColors[value.level](levels[value.level]);
    }
}

export default pretty;

#!/usr/bin/env node
import process from 'node:process';
import fs from 'node:fs';
import meow from 'meow';
import prettyBytes from 'pretty-bytes';
import {gzipSizeSync} from 'gzip-size';
import chalk from 'chalk';
import getStdin from 'get-stdin';
import glob from 'glob';

const cli = meow(`
	Usage
	  $ gzip-size '<pattern>'
	  $ cat <file> | gzip-size

	Options
	  --level             Compression level [0-9] (Default: 9)
	  --raw               Display value in bytes
	  --include-original  Include original size

	Examples
	  $ gzip-size unicorn.png
	  192 kB
	  $ gzip-size unicorn.png --raw
	  192256
	  $ gzip-size unicorn.png --include-original
	  392 kB → 192 kB
`, {
	importMeta: import.meta,
	flags: {
		level: {
			type: 'number',
		},
		raw: {
			type: 'boolean',
		},
		includeOriginal: {
			type: 'boolean',
		},
	},
});

const [pattern] = cli.input;

if (!pattern && process.stdin.isTTY) {
	console.error('Specify a file path');
	process.exit(1);
}

const options = {};
if (cli.flags.level) {
	options.level = cli.flags.level;
}

function output(originalSize, gzippedSize, postfix='') {
	let message = cli.flags.raw ? gzippedSize : prettyBytes(gzippedSize);
	if (cli.flags.includeOriginal) {
		message = (cli.flags.raw ? originalSize : prettyBytes(originalSize)) + chalk.dim(' → ') + message;
	}

	console.log(message, postfix);
}

function getSize(data) {
	const originalSize = data.length;
	const gzippedSize = gzipSizeSync(data);

	return [originalSize, gzippedSize];
}

(async () => {
	if (pattern) {
		let totalOriginialSize = 0;
		let totalGzippedSize = 0;

		const files = glob.sync(pattern);

		files.forEach(file => {
			const [originalSize, gzippedSize] = getSize(fs.readFileSync(file));
			output(originalSize, gzippedSize, file);
			totalOriginialSize += originalSize;
			totalGzippedSize += gzippedSize;
		});

		if (files.length > 1) {
			console.log('------------\nTotal:');
			output(totalOriginialSize, totalGzippedSize);
		}
	} else {
		const size = getSize(await getStdin.buffer());
		output(...size);
	}
})();

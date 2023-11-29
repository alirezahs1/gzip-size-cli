# gzip-size-cli

> Get the gzipped size of a file or stdin \
> Added support of **patterns** compared to [main version](https://github.com/sindresorhus/gzip-size-cli)

## Install

```sh
npm install --global git+https://github.com/alirezahs1/gzip-size-cli
```

## Usage

```
$ gzip-size --help

  Usage
    $ gzip-size <pattern>
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
		$ gzip-size build/**/*.js
```

## Related

- [gzip-size](https://github.com/sindresorhus/gzip-size) - API for this module

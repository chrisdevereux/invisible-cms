#!/bin/bash

function clean() {
  rm -rf dist 2> /dev/null
}

function build() {
  pwd

  clean
  tsc --module commonjs --outDir dist/commonjs
  tsc --module esnext --outDir dist/esnext

  rm -rf dist/**/*.stories.js 2> /dev/null
  exit 0
}

"$@"

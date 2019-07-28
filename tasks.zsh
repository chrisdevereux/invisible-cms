#!/bin/bash

PATH=./node_modules/.bin:$PATH

function clean() {
  rm packages/*/*.js
  rm packages/*/*.mjs
  rm packages/*/*.map
  rm packages/*/*.d.ts
  rm packages/*/lib/**/*.js
  rm packages/*/lib/**/*.mjs
  rm packages/*/lib/**/*.map
  rm packages/*/lib/**/*.d.ts
}

function build() {
  clean
  tsc --module commonjs
}

"$@"

export PATH=$PATH:$(pwd)/node_modules

rm packages/*/*.js
rm packages/*/*.mjs

tsc

for i in packages/*/*.js
do
  mv "${i}" "${i/%js/mjs}"
done

tsc --module commonjs

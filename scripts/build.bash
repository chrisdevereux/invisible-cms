export PATH=$PATH:$(pwd)/node_modules

rm packages/*/*.js
rm packages/*/*.mjs
rm packages/*/*.map
rm packages/*/*.d.ts

# tsc

# for i in packages/*/*.js
# do
#   mv "${i}" "${i/%js/mjs}"
# done

# for i in packages/*/*.js.map
# do
#   mv "${i}" "${i/%js.map/mjs.map}"
# done

tsc --module commonjs

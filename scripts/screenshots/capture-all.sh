#!/bin/bash
# Recaptures every screenshot used by the site. Takes about 4 minutes; Larvyn windows
# open and close on their own, so leave the mouse and keyboard alone while it runs.
# Coordinates are for the default 1440x900 window.
set -e
cd "$(dirname "$0")"

./shots.sh overview overview
AFTER=12 ACT="click:418,207" ./shots.sh overview-running overview # Start dev stack
ACT="click:860,150;type:Add stock validation to checkout. Reject items with not enough stock with a 422 and make CheckoutTest pass." ./shots.sh agents agents
RUN="php artisan about" ./shots.sh terminals terminals
./shots.sh artisan artisan
./shots.sh routes routes
ACT="click:352,209" ./shots.sh models models                 # Order model
WAIT=12 ACT="click:360,542" ./shots.sh database database     # orders table
AFTER=5 ACT="click:1360,66" ./shots.sh tinker tinker          # Run
ACT="click:460,293" ./shots.sh tests tests                   # expand the first failure
./shots.sh queues queues
ACT="click:700,153" ./shots.sh logs logs                     # expand the first error
ACT="click:370,255" ./shots.sh git git                       # show the diff
./shots.sh env env
./shots.sh deps deps
./shots.sh palette-agent overview "add stock validation to checkout and make the failing test pass"

# Social preview image
node -e "require('sharp')('../../src/assets/screens/overview-running.png').resize(1200,630,{fit:'cover',position:'top'}).png().toFile('../../public/og.png')"
echo done

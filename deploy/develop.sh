#/usr/bin/env bash

# cleanup on error
function cleanup() {
  echo "cleanup"
}

source ~/.bashrc
source ~/.nvm/nvm.sh

node -v

nvm use 14

echo "Stop old process"
pm2 --silent stop futures_api_staging
pm2 --silent stop futures_agg_staging
echo "Stopped"
set -e
echo "Move old directory"
rm -rf /var/www/futures/stage/old
mv /var/www/futures/stage/current/ /var/www/futures/stage/old

echo "clear old directory"
rm -rf /var/www/futures/stage/current/*

echo "Copy source to directory"
cd /var/www/futures/stage/source/ && yarn
mkdir /var/www/futures/stage/current
cp -r /var/www/futures/stage/source/* /var/www/futures/stage/current
cp /var/www/futures/stage/source/.env /var/www/futures/stage/current

echo "Start new process"
cd /var/www/futures/stage/current && yarn pm2:start:all:staging
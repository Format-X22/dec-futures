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
pm2 --silent stop futures_api
pm2 --silent stop futures_agg
echo "Stopped"
set -e
echo "Move old directory"
rm -rf /var/www/futures/production/old
mv /var/www/futures/production/current/ /var/www/futures/production/old

echo "clear old directory"
rm -rf /var/www/futures/production/current/*

echo "Copy source to directory"
cd /var/www/futures/production/source/ && yarn
mkdir /var/www/futures/production/current
cp -r /var/www/futures/production/source/* /var/www/futures/production/current
cp /var/www/futures/production/source/.env /var/www/futures/production/current

echo "Start new process"
cd /var/www/futures/production/current && yarn pm2:start:all:production
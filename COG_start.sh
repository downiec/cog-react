#!/bin/bash

#This is a script meant for development only.
#It assumes this repo is in the same directory as the COG repo.
#A fork of the COG repo is required to run this script. Forked COG repo: https://github.com/downiec/COG

# Exit for any error
set -e

#Build the React Application
if [ "$1" = "--build" ]; then
    npm run build
fi

#Export config directory
COG_DIR=../COG/

#Update latest React App files

# Remove existing files if they exist, ignore error if they don't exist
echo "Removing old js files."
rm ${COG_DIR}cog/static/cog/cog-react/js/* || true
echo "Removing old css files."
rm ${COG_DIR}cog/static/cog/cog-react/css/* || true
# Copy new files into appropriate location within COG repo
echo "Copying new js files."
mkdir -p ${COG_DIR}cog/static/cog/cog-react/js/
cp build/static/js/*.js ${COG_DIR}cog/static/cog/cog-react/js/
cp build/static/js/*.map ${COG_DIR}cog/static/cog/cog-react/js/
echo "Copying new css files."
mkdir -p ${COG_DIR}cog/static/cog/cog-react/css/
cp build/static/css/* ${COG_DIR}cog/static/cog/cog-react/css/

#Run cog server and (restart if the cog server is already running)
echo "Setting up COG server"
if PID=$(lsof -i:3000 -t); then
    echo "Restarting COG server..."
    kill $PID
else
    echo "Starting COG server..."
fi

python ${COG_DIR}manage.py runserver 0.0.0.0:3000

#!/bin/bash

#This is a script meant for development only.
#A fork of the COG repo is required to run this script. Forked COG repo: https://github.com/downiec/COG

# Exit for any error
set -e

# Set the correct COG directory
if [[ ! -d $COG_DIR ]]; then
    read -e -p "Enter the path to the current COG installation: " COG_DIR
fi
COG_REACT=${COG_DIR}static/cog/cog-react/

function cleanDir (){
    mkdir -p ${COG_REACT}js/
    mkdir -p ${COG_REACT}css/
    # Remove existing files if they exist, ignore error if they don't exist
    echo "Removing old js files."
    rm ${COG_REACT}js/* || true
    echo "Removing old css files."
    rm ${COG_REACT}css/* || true
}

function copyFiles (){
    cleanDir
    # Copy new files into appropriate location within COG repo
    echo "Copying new js files."
    cp build/static/js/*.js ${COG_REACT}js/
    cp build/static/js/*.map ${COG_REACT}js/
    echo "Copying new css files."
    cp build/static/css/* ${COG_REACT}css/
}

function buildCogReact (){
    npm run build-static
    cleanDir
    copyFiles
}

#Run local cog server and (restart if the cog server is already running)
function startLocalCOG (){
    echo "Setting up COG server"
    if PID=$(lsof -i:3000 -t); then
        echo "Restarting COG server..."
        kill $PID
    else
        echo "Starting COG server..."
    fi

    python ${COG_DIR}manage.py runserver 0.0.0.0:3000
}

#Build the React Application
if [[ "$1" = "--build" ]]; then
    buildCogReact
elif [ "$1" = "--run"]; then
    startLocalCOG
else
    buildCogReact
    startLocalCOG
fi
#!/bin/bash

#This is a script meant for development only.
#A fork of the COG repo is required to run this script. Forked COG repo: https://github.com/downiec/COG

# Exit for any error
set -e

# Set the config file
cog_config="cog_build.config"
if [[ -f ${cog_config} ]]; then
    . ${cog_config}
else
    echo "$cog_config file not found."
    echo "Make sure it is in the same directory as COG_tasks.sh"
fi

# Check cog directory
if [[ ! -d $COG_DIR ]]; then
    echo "COG_DIR variable is not a valid directory."
    echo "Check the variables set in: $cog_config"
    exit
fi

COG_REACT=${COG_DIR}static/cog/cog-react/

# Check config file variables for conda setup
function prepareConda (){
    if [[ ! -f $CONDA_EXE ]]; then
        echo "CONDA_EXE variable is not a valid file."
        ERR=1
    else
        source $CONDA_EXE
        RET=$?
        if [[ ! ${RET} -eq 0 ]]; then
            echo "Setting conda source directory failed."
            ERR=1
        fi
    fi
    if [[ -z $CONDA_ENV ]]; then
        echo "CONDA_ENV variable is empty."
        ERR=1
    else
        conda activate $CONDA_ENV
        RET=$?
        if [[ ! ${RET} -eq 0 ]]; then
            echo "Activating conda environment failed."
            ERR=1
        fi
    fi
    if [[ ! $ERR -eq 0 ]]; then
        echo "There were one or more issues with config settings."
        echo "Check the variables set in: $cog_config"
        exit
    fi
}

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
    # Copy new files into appropriate location within COG repo
    echo "Copying new js files."
    cp build/static/js/*.js ${COG_REACT}js/
    cp build/static/js/*.map ${COG_REACT}js/
    echo "Copying new css files."
    cp build/static/css/* ${COG_REACT}css/
}

function buildCogReact (){
    prepareConda
    npx react-scripts build
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
elif [[ "$1" = "--run" ]]; then
    startLocalCOG
elif [[ "$1" = "--copy" ]]; then
    if [[ -d "$2" ]]; then
        echo $2
        COG_REACT=$2
    fi
    cleanDir
    copyFiles
else
    buildCogReact
    cleanDir
    copyFiles
fi
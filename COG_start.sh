#This is a script meant for development only.
#It assumes this repo is in the same directory as the COG repo.
#The COG repo is required to run this script. COG repo: https://github.com/EarthSystemCoG/COG

#Export config directory
export COG_CONFIG_DIR=~/Desktop/COG_devel/COG/

#Build the React Application
npm run build

#Update latest React App files
echo "Removing old js files."
rm ../COG/cog/static/cog/cog-react/js/*
echo "Removing old css files."
rm ../COG/cog/static/cog/cog-react/css/*
echo "Copying new js files."
cp build/static/js/* ../COG/cog/static/cog/cog-react/js/
echo "Copying new css files."
cp build/static/css/* ../COG/cog/static/cog/cog-react/css/
echo "Setting up COG server"

#Run cog server and (restart if the cog server is already running)
if PID=$(lsof -i:8000 -t); then
    echo "Restarting COG server..."
    kill $PID
else
    echo "Starting COG server..."
fi

python ../COG/manage.py runserver

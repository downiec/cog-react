#This is a script meant for development only.
#It assumes this repo is in the same directory as the COG repo.
#A fork of the COG repo is required to run this script. Forked COG repo: https://github.com/downiec/COG

#Build the React Application
npm run build

#Export config directory
export COG_CONFIG_DIR=../COG/

#Update latest React App files
echo "Removing old js files."
rm ../COG/cog/static/cog/cog-react/js/*
echo "Removing old css files."
rm ../COG/cog/static/cog/cog-react/css/*
echo "Copying new js files."
mkdir -p ../COG/cog/static/cog/cog-react/js/
cp build/static/js/*.{js, map} ../COG/cog/static/cog/cog-react/js/
echo "Copying new css files."
mkdir -p ../COG/cog/static/cog/cog-react/css/
cp build/static/css/* ../COG/cog/static/cog/cog-react/css/
echo "Setting up COG server"

#Run cog server and (restart if the cog server is already running)
if PID=$(lsof -i:8000 -t); then
    echo "Restarting COG server..."
    kill $PID
else
    echo "Starting COG server..."
fi

python ../COG/manage.py runserver 0.0.0.0:3000

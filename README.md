This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Using drop-down components in your project

### Install the components:

`npm install --save esgf-subscriptions`

### Then implement in your project using example: [ESGF-Subscriptions App](components/App.tsx)

<br >


# Developer Initial Setup
### Clone esgf-subscriptions repo and COG fork, they should be in the same directory:

`git clone https://github.com/downiec/COG`

`git clone https://github.com/downiec/esgf-subscriptions.git`
## Developing as NPM package

After making changes, build package using:
### `npm run build`

Builds the app as an NPM package for publication using Rollup.js.<br>
The package is then ready to be published or tested!

## Integrating with COG

To install as an app within the COG repo, do the following:

```
# Within esgf-subscriptions repo
npm install
./COG_tasks.sh --build #May need sudo privileges
```

You should now be able to run scripts as described below.

## Available Scripts (run from the esgf-subscriptions repo)

### `npm start`

Command above runs the app in the development mode. This will only show the esgf-subscriptions front-end as it looks and behaves OUTSIDE of COG.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.<br>

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## COG Integration and Testing

Note: You may need to run some of the scripts for copying over files into the COG installation directory using `sudo` privileges.
### `./COG_tasks.sh`

The above command will first build the front-end, copy it into the COG application, then run it; combining the two commands described below.

### `./COG_tasks.sh --build`

Above command will build the esgf-subscriptions application for legacy COG integration and copy over static files from the current front-end to place them in the appropriate COG installation directory. 
The build is minified and the filenames include the hashes.<br>

### `./COG_tasks.sh --run`

Above command starts up a forked instance of the COG Django application. Once the service is started, you can view the page here: http://localhost:8000/subscription/
#### IMPORTANT: You will need the COG setup files containing config files in order to interact with COG server. Make sure you already built the application previously with: `./COG_tasks.sh --build`

#### After cog service starts if you are routed to the login screen, you can login by:
* Click the button near the ‘OpenID’ label.
* Select ‘LLNL Test Dev IDP’ from the drop down.
*Or use the other LLNL option if Test Dev doesn't work.
* Click ‘login’
* Enter username and password.
* Click ‘SUBMIT’

<!--
### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
-->
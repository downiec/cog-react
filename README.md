This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode. This will only show the Cog-React front-end
as it looks and behaves outside of COG.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.<br>

### `npm run COG`

Starts up a forked instance of the COG Django application. Then it will copy over static files from this Cog-React
front-end application and place them in the appropriate directory in order to view the react front-end as it would
appear within the COG application. Once the service is started, you can view the page here: http://localhost:8000/subscription/

#### `Important!`

When first setting up, you must make sure to update the COG_start.sh script to use the correct path to your local COG directory. Line 6 in the script:
COG_CONFIG_DIR=~/Desktop/COG_devel/COG/
Needs to be changed to match the path to your COG repository.
The COG fork used for development: https://github.com/downiec/COG


#### Note:
If you are routed to the login screen, you can login by:
* Click the button near the ‘OpenID’ label.
* Select ‘LLNL Test Dev IDP’ from the drop down.
* Click ‘login’
* Enter username and password.
* Click ‘SUBMIT’

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# invisible-cms-example-firebase-netlify-gatsby

a starter project for invisible-cms running on free cloud services. it uses:

* firebase to host the cms data and authenticate editors
* netlify to host the site
* gatsby as a build tool

once we're all set up, we will have:

* the main, user-facing site, hosted on netlify and built from this repo
* the admin interface, hosted on netlify and built from this repo
* cms data and revision history
* authentication of cms editors and support for multiple login methods
* a button to trigger a deploy of the user-facing site to netlify

the main things of interest that this repo contains are:

* a `gatsby-config.js` to bundle together everything we need.
* a firebase cloud function `functions/cms.js` that acts as a minimalistic cms 'backend' (to handle versioning, deployment, etc and keep the credentials that do these things private)
* page templates for our example site (in `src/templates`)

## local setup

* install dependencies of the main site and backend by running `yarn && (cd functions && yarn)`
* set up a new firebase project at https://console.firebase.google.com
* enable the email and google sign-in methods
* set up your dev configuration by running `cp config/example.env .env` and providing firebase configurations in the `.env` file as detailed there
* `yarn backend` to start the cms backend
* `yarn edit` to run the cms locally in admin mode
* `yarn start` to run the cms locally in nonadmin mode

## deploying

### backend (to firebase)

* install firebase cli `yarn global add firebase-tools` and login using `firebase login` if needed
* run `firebase init functions` to connect to your firebase project. set the one you created earlier from the list. select your firebase project from the list, javascript as the language, and answer no to everything else
* provide the required environment config to firebase. you can do this quickly by running `(source .env && firebase functions:config:set cms.firebase_credential="$FIREBASE_CREDENTIAL")`
* deploy by running `firebase deploy --only functions`
* you'll need to switch to the blaze plan in order to deploy to netlify. this is free, so long as you stay within the usage limits

### frontend (to netlify)

* push this repo to a git remote
* set up **two** netlify projects, one for your admin site, one for your public-facing site. configure both to deploy from your git repo
* in your admin site, provide `FIREBASE_CONFIG` to netlify as a build setting (copied from your .env)
* in *both* projects, provide `CMS_ENDPOINT` to netlify as a build setting. the trigger url of our cms firebase cloud function. you can find it in the firebase functions dasboard after deploying the backend and it will look a bit like `https://us-central1-my-cms-test-124.cloudfunctions.net/cms`
* ensure that the firebase project is configured to allow logins from the admin site domain
* create a new webhook for the public-facing site. provide it to the backend by running `firebase functions:config:set cms.netlify_deploy_hook=<webhook url>`
* redeploy the backend now that it's connected to netlify by running `firebase deploy --only functions`
* redeploy both netlify projects. you should now be live!

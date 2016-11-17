# Public Transportation App 

> Project #2 of the [Senior Software Nanodegree](https://www.udacity.com/course/senior-web-developer-nanodegree-by-google--nd802) by **Google** and [Udacity](https://www.udacity.com/).

## Goal

You must build an application that allows users to select a departure and arrival train station. The user will 
then see information about the two stations. The information you provide may include connected stations on the path, arrival & departure times, or any other information you deem important for the user. 

Initially, the application should load a default train schedule, this can be a general schedule, a live schedule, or simply a transit map - many public transportation agencies offer this information via an API, as a *GTFS file* (for example, CalTrain or the My511.org transit data feed), or as an image. When the application is online the user should be able to see up to date information from the transit authority of choice. 

When offline the user should be able to continue to interact with the site in some capacity (e.g. The user has full access to the general schedule or the user is able to see route information they have accessed while online.)

This structure project is based on [Web Starter Kit](https://developers.google.com/web/tools/starter-kit/) by Google.

### Features

| Feature                                | Summary                                                                                                                                                                                                                                                     |
|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Responsive boilerplate | A responsive boilerplate optimized for the multi-screen web. Powered by [Material Design Lite](http://getmdl.io).  You're free to use either this or a completely clean-slate  via [basic.html](https://github.com/google/web-starter-kit/blob/master/app/basic.html).                          |
| Sass support                           | Compile [Sass](http://sass-lang.com/) into CSS with ease, bringing support for variables, mixins and more. (Run `gulp serve` or `gulp` for production)                                                                                                      |
| Performance optimization               | Minify and concatenate JavaScript, CSS, HTML and images to help keep your pages lean. (Run `gulp` to create an optimised version of your project to `/dist`)                                                                                                |
| Code Linting               | JavaScript code linting is done using [ESLint](http://eslint.org) - a pluggable linter tool for identifying and reporting on patterns in JavaScript. Web Starter Kit uses ESLint with [eslint-config-google](https://github.com/google/eslint-config-google), which tries to follow the Google JavaScript style guide.                                                                                                |
| ES2015 via Babel 6.0                   | Optional ES2015 support using [Babel](https://babeljs.io/). To enable ES2015 support remove the line `"only": "gulpfile.babel.js",` in the [.babelrc](.babelrc) file. ES2015 source code will be automatically transpiled to ES5 for wide browser support.  |
| Built-in HTTP Server                   | A built-in server for previewing your site locally while you develop and iterate                                                                                                                                                                            |
| Live Browser Reloading                 | Reload the browser in real-time anytime an edit is made without the need for an extension. (Run `gulp serve` and edit your files)                                                                                                                           |
| Cross-device Synchronization           | Synchronize clicks, scrolls, forms and live-reload across multiple devices as you edit your project. Powered by [BrowserSync](http://browsersync.io). (Run `gulp serve` and open up the IP provided on other devices on your network)                       |
| Offline support                     | Thanks to our baked in [Service Worker](http://www.html5rocks.com/en/tutorials/service-worker/introduction/) [pre-caching](https://github.com/google/web-starter-kit/blob/master/gulpfile.babel.js#L226), sites deploying `dist` to a HTTPS domain will enjoy offline support. This is made possible by [sw-precache](https://github.com/GoogleChrome/sw-precache/).                                                                                                                                              |
| Index DB                            | Uses a A Minimalistic Wrapper for IndexedDB called [Dexie](http://dexie.org/) |


## Browser Support

At present, we officially aim to support the last two versions of the following browsers:

* Chrome
* Edge
* Firefox
* Safari
* Opera
* Internet Explorer 9+

This is not to say that Web Starter Kit cannot be used in browsers older than those reflected, but merely that our focus will be on ensuring our layouts work great in the above.

## Installation

1. **Clone** or **Download** the [git project](https://github.com/codesandtags/public-transportation-app).

2. [Use npm](https://docs.npmjs.com/cli/install) to install all dependencies in the _package.json_.
```sh
npm install
```

3. Once you finish to install the dependencies you can start the project using the *gulp tasks*. 
(please review the [gulpfile.babel.js](https://github.com/codesandtags/public-transportation-app/blob/master/gulpfile.babel.js)

## Usage

#### Run development tasks:
By default *gulp* command run the *development* task.

- Start the server in development mode
```
gulp serve
```

- Start the server in production mode
```
gulp serve:dist
```


### More Features in the Project

- Mobile-first approach
- Offline-first approach
- Implementation of service workers
- Use ES6 in some parts
- Automate task with gulp
- Use fetch and promises instead of XHR / Ajax request
- Use Material design template

## Licence
**
Apache 2.0

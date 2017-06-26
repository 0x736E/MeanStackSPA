## How it works

The single page application is written in
[Typescript](https://www.typescriptlang.org/) with
[Angular 2](https://angular.io/). The server- side component is written in
javascript with Nodejs, MongoDB through [Mongoose](http://mongoosejs.com/)
object data modeling, Express for the web-server.

The server and client communicate almost exclusively via
[socket.io](https://socket.io/) channels to provide performant real-time
behaviour.

Accounts are authenticated using Twitter, via the [passport](http://passportjs.org/)
middleware in express, while the sessions are shared with socket.io clients.

## Features

* CRUD tasks
  - *Create* new tasks by typing in the text box
  - *Read* new tasks by loading the page
  - *Update* tasks by click on an existing task, and typing in the text box,
   then press enter or click the 'edit' button.
  - *Delete* tasks by click on the 'x' to the right of any task
* Utilizes socket.io for live updates, potential for collaborative lists
  - why REST when you can Stream?
* MEAN stack
  - MongoDB (via Mongoose)
  - Express
  - Angularjs
  - Nodejs
* Angular 2 based single-page-application (SPA)
* Utilizes gulp streaming build system
  - makes use of angular's cli to build the SPA and copy it to the static public
  directory
* socket.io and express sessions are shared by using the same session middleware
  - supprisingly poorly documented feature!
* bare minimum security**
  - JSON Web Tokens would be nice
* complete lack of code-coverage via unit tests

## Setup

### Requirements:

* [MongoDB](https://www.mongodb.com/)
* [Nodejs](https://nodejs.org/en/)
* [Angular CLI](https://cli.angular.io/)
* [gulp CLI](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)

### Twitter Credentials
Login requires that you fill in the twitter credentials for your own twitter
application. Setup is easy and is described in greater detail
[here](http://passportjs.org/docs/twitter)

```text
copy private/keys.sample to private/keys.json
paste in your own keys in the appropriate places.
```

#### Building from source
```bash
npm install
gulp build
gulp serve
```

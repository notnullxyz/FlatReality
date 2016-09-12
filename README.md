# README #

FlatReality is the codename for the virtual world project. If you have to ask, you probably don't need it.

## Development ##

### Get up and running ###
* Clone
* Install webpack globally: `npm install webpack -g`
* Install deps: `npm install`
* Run webpack to build dist files: `webpack`, or,
* Run webpack in watch mode: `webpack --progress --colors --watch` or,
* Run webpack dev server, the best way... `webpack-dev-server --progress --colors` (but this will require install of `npm install webpack-dev-server -g`)
* Browse to the dist/ build on `http://localhost:8080` - bob's your uncle.

### Code ###
* Create a feature branch off **dev** `git checkout -b 20160910_someFeature` (or whatever really)
* Commit often.
* Create a PR to merge back to **dev**

I am aiming to keep `master` fairly pristine and production ready. Chaos may thrive in a controlled way in `dev` however, but feature branches are absolutely neccesary.

### Last but not least ###

For the sake of order and all things spicy:

* Comment well, and/or:
* Document on WIKI
* Make/edit/update Issues/Tickets

### Who do I talk to? ###

* Repo owner Marlon van der Linde <marlon250f@gmail.com> or <marlon@notnull.xyz>
* Any of the developers on the project...
* Alternatively, pop into Slack on Strange-Cargo -> #code :-)

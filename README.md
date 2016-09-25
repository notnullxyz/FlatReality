# README #

FlatReality is the codename for an WebGL idea-project I have in mind. This repo represents a base, buildable, devvable starting point for this project.
I have implemented a ready to clone, ready to build and deploy codebase based on ThreeJS, with the following, gratis:

* Basic WASD+Jump controls/inputs (with a Perspective Camera)
* An asynchronous loader for the textures (which you can see on the floors and cubes)
* Procedurally generated cubes, so that the base scene has something to work with.
* Some light sources (Direction, Point, Hemi)

What is still needed, is collision detection, websockets and to hook up my current 'infinite world generation' code, but I am not sure if that will be integrated into this repository yet.

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
* Any of the developers on the project... (just me for now ^)
* Alternatively, pop into Slack on Strange-Cargo -> #code :-)

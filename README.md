# blue
Code for the blue team.

## Setup (for Windows)
1. [Install git](https://git-for-windows.github.io/)
2. [Install node](https://nodejs.org/en/)
3. Clone the repository
  1. Open Git Bash
  2. Inside the terminal, run `git clone https://github.com/CS455-Cyan/blue.git`
3. Install node dependencies
  1. Still inside the terminal, run `cd blue/api` to change directories
  2. Now run `npm install`

Hopefully that works!

## Running the server
1. Open up a terminal and `cd` into the `blue` repository.
2. Now `cd` into the `api` directory: `cd api`
3. Start the server: `node api.js`

The server will run as long as you leave it up. You can kill it with `ctrl + c`

## Initializing the database
It will be helpful during development to be able to programmatically set the database to a certain state, with certain known sample records inserted. The file `scripts/initializeDatabase.js` is a throw-away script that does this. Feel free to edit it at any time to customize it to your needs for testing, and to initialize new collections in the database.

1. Navigate to this repo's home directory (`blue`)
2. Run `cd scripts`
3. Run `node initializeDatabase.js`

The script will let you know once it's finished. After that you can kill it with `ctrl + c`.

## Relevant files

* `api/models/catalog.model.js` This file is where we describe the structure of our data. It should reflect [this document](https://drive.google.com/open?id=1K9UBM-vfAotRwtsBX8bN12OjiVsqQ6R_6pN9YugiBpQ).
* `api/routes/catalog.js` This file is where we handle API requests. It should reflect [this document](https://drive.google.com/open?id=1chPKE1WVSA3kWQ4xs7IhyLyomoH2w8S-mZ0y8HShJm8) and return data similar to [this example](https://drive.google.com/open?id=0B7bRJi6ppRPbRXFWWWQwNFY2Tms).
* `scripts/initializeDatabase.js` This is throw-away code we can use to clear and re-populate the database with sample data. Helpful for testing code.

## Tools

### Git/Github

The directions to clone the repository are mentioned above. When you're ready to make changes, execute the following commands to commit your changes and then push them to the repository:

#### Making changes

1. `git checkout dev`
  * This switches you from the `master` branch to the `dev` branch. We want to make all of our changes on the `dev` branch, and then occasionally merge our changes on `dev` to `master` after they have been tested and approved by our SQA.
  * You don't need to run this command if you're already on the `dev` branch (though it won't hurt). To check which branch you're on, you can run `git branch`. Your current branch is marked by an asterisk (*).
2. `git add -A`
  * This 'stages' all of your changes. Basically it's just specifying which changes you want to commit.
3. `git commit`
  * This creates a checkpoint in your local repository. You will be prompted to enter a commit message (a message is already generated; all you have to do is uncomment it).
4. `git push`
  * This shares your local changes to the remote repository hosted on github.

#### Getting other people's changes

`git pull`

It doesn't hurt to run this command every time you start coding, to make sure you don't get left behind.

### Postman

Postman is a chrome extension that allows us to easily interact with our API, sending `GET`, `PUT`, `POST`, `DELETE` requests and the like. Get it [here](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop).

To get the latest updated collection of API calls in postman:

1. Go to the [postman channel](https://cs455cyan.slack.com/messages/postman/details/) in slack and download the latest file posted there.
2. OR just copy this link: https://www.getpostman.com/collections/891e7ca0ec593b1d2308
3. In the postman app, click `import` at the top left. Then use either the link or file from above to complete.

### Node.js

Node.js is a server-side implementation of the Javascript language. We are using it to power our application.

### Mongoose & MongoDB

Mongoose is a abstraction over the MongoDB database. 

See the [documentation](http://mongoosejs.com/docs/guide.html) to learn about using Mongoose.

### mlab (formerly MongoLab)

mlab is a freemium hosting service for MongoDB. We're using it so we don't each have to maintain a local Mongo database for development.

If you ever feel the need to look at the database directly to see what the h*ll is going on, you can log in to [mlab.com](https://mlab.com) with credentials that have been posted in slack.

## Coding Standards

We will use [W3Schools' JavaScript Style Guide](http://www.w3schools.com/js/js_conventions.asp), with one exception: we will use *tabs* for indentation (not spaces).

## Resources

Here are links to some resources which can help you get familiar with our tools & technology.

* [Mongoose docs](http://mongoosejs.com/docs/guide.html)
* [Free and awesome interactive Javascript lesson from codecademy](https://www.codecademy.com/learn/javascript)
* More to come (maybe)...

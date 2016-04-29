/***																					***\

	Filename: api.js
	Author: Tyler Yasaka, Mitchel Moon

	Copyright (c) 2015 University of North Alabama

\***																					***/


/*--																					--*\
**						API SETUP/CONFIGURATION						**
\*--																					--*/

// Set timezone
process.env.TZ = 'America/Chicago';

var routes =
[
	require('./routes/states.routes'),
	require('./routes/admin.routes'),
	require('./routes/catalog.routes')
];

var modules =
{
	'express': require('express'),
	'connect-mongo': require('connect-mongo'),
	'express-session': require('express-session'),
	'body-parser': require('body-parser')
};

var app = modules.express();

// session definition
var sessionStore = modules['connect-mongo'](modules['express-session']);
var sessionStoreInstance = new sessionStore({ url: 'mongodb://cyan:8029df8b@ds027835.mongolab.com:27835/sessions' });

app.use
(
  modules['body-parser'].json()
);

app.use
(
  modules['body-parser'].urlencoded
  (
    {
      extended: true
    }
  )
);

app.use
(
  modules['express-session']
  (
    {
      store: sessionStoreInstance,
      secret: '8029df8b',
      resave: false,
      saveUninitialized: false
    }
  )
);

app.use('/public', modules.express.static(__dirname + '/public'));

app.use('', routes);

var server = app.listen(8080);

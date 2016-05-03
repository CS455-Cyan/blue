# Installation instructions:

1. Make sure you have system dependencies:
- node.js
- mongodb
- forever (node.js module, must be installed globally)

2. Install modules and run setup script.
- Run `npm install`
- Run `node scripts/setup.js`

3. Create a primary admin
- Edit the file `scripts/adduser.js`:
- Set desired username and password at top of file
- Run `node scripts/adduser.js`
- Secondary admins can be created within the primary admin interface
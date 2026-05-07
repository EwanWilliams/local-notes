# local.notes
A collaborative note taking web application for locally hosted portable servers. Undergraduate Software Engineering dissertation project.

## Instructions for running a test instance of local.notes

Please ensure you have Node.js with npm installed and a local MongoDB service running.

1. Clone this repository
2. Navigate to `/src`
3. Run `npm i` to gather dependencies
4. Create a `.env` file with the following contents:
   ```
   _PORT = 3000
   _CLIENT_PORT = 5173
   DB_URI = mongodb://localhost/local-notes
   NODE_ENV=development
   SOCKET_ADMIN_USER=test
   SOCKET_ADMIN_PWD=test
   IO_URL=http://localhost:3000
   ```
5. Generate a 64 character hex encryption key, or use this example one just for testing
   ```
   37e0f80a8a32df975b1dad06282341cb33c97b7691cc5c16ac5589294070b796
   ```
6. Run `npm run build` to build the frontend
7. Run `npm run start` to start the service, you will be prompted for the hex key on startup. You should be greeted the following lines in the CLI.
   ```
   Server running on port 3000
   Connected to DB.
   ```
8. Visit `http://localhost:3000/` to access local.notes. You can use multiple browser tabs to see collaboration and incognito tabs or a different browser to set different nicknames on the same machine.

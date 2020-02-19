/* eslint-disable @typescript-eslint/no-var-requires */
const { ipcRenderer } = require('electron');
const dbInit = require('./db/db.service');

const graphQlServer = require('./graphql/server');

async function graphQl() {
  await dbInit();
  graphQlServer.start(() => {
    ipcRenderer.send('server-ok');
    console.log('Server running on localhost:4000');
  });
}

graphQl();

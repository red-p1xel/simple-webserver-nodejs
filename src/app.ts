import { networkInterfaces } from 'os';
import * as https from 'https';
import express, { Application, Request, Response } from 'express';
import { File, loadFiles } from './fileLoad';
import { keyPairVerifier } from './utils';

const app: Application = express();
let server: https.Server;
let files: Promise<void>;

export async function filePath(file: File) {
  try {
    const keys = await loadFiles(file.dir, file.extensions);
    if (keys.length >= 2) {
      keyPairVerifier({
        keys: keys.map((item) => {
          return {
            data: item.content.toString()
          };
        })
      });
      // TODO: Create instance of https server if loaded keys is verified
    }
  } catch (error) {
    // TODO: Display beautified error messages in terminal output
    console.warn('ERROR', error);
  }
}

files = filePath({ dir: '.', extensions: ['pem'] });

app.get('/', (request: Request, response: Response) => response.send('--`.++.`-- Hello world!'));

// TODO: Use only https instance without http, if keypair doesn't found, interactively display prompt to generate keys
server = https.createServer({}, app);
//   server = https.createServer(
//     {
//       key: fs.readFileSync(process.env.SSL_KEY, 'utf-8'),
//       cert: fs.readFileSync(process.env.SSL_CERT, 'utf-8')
//     },
//     app
//   );
// TODO: Fix server protocol and message output issues.
server.listen(process.env.PORT, () => {
  const serverIp = Object.values(networkInterfaces())
    .reverse()
    .flat()
    .find((ni) => ni?.family === 'IPv4' && !ni?.internal)?.address;

  // TODO: Implement redirection from http to https
  // TODO: Implement support of trusting proxies
  const serverInfo = `https://${serverIp}:${process.env.PORT} and https://127.0.0.1:${process.env.PORT}`;
  console.info(`--::::--[ Server started at ${serverInfo}`);
});

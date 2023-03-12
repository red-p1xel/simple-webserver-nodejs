import { networkInterfaces } from 'os';
import * as http from 'http';
import * as https from 'https';
import * as dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import { File, loadFiles } from './fileLoad';

const app: Application = express();
let server: https.Server | http.Server;

// TODO: Implement files content validation
export function filePath(file: File) {
  loadFiles(file.dir, file.extensions).then(console.log);
}
filePath({ dir: '.', extensions: ['pem'] });

dotenv.config();

app.get('/', (request: Request, response: Response) => response.send('Hello world!'));

// TODO: Reimplement create server instance based on key files instead of variables declared into .env
// if (
//   !process.env?.SSL_KEY ||
//   !process.env?.SSL_CERT ||
//   (process.env.SSL_CERT || process.env.SSL_KEY) === 'null'
// ) {
  server = http.createServer({}, app);
  // } else {
//   server = https.createServer(
//     {
//       key: fs.readFileSync(process.env.SSL_KEY, 'utf-8'),
//       cert: fs.readFileSync(process.env.SSL_CERT, 'utf-8')
//     },
//     app
//   );
// }
// TODO: Fix server protocol and message output issues.
server.listen(process.env.PORT, () => {
  const protocol: string = server instanceof https.Server ? 'https' : 'http';
  const serverIp = Object.values(networkInterfaces())
    .reverse()
    .flat()
    .find((ni) => ni?.family === 'IPv4' && !ni?.internal)?.address;

  const serverInfo = `${protocol}://${serverIp}:${process.env.PORT} and ${protocol}://127.0.0.1:${process.env.PORT}`;
  console.info(`>> Server started at ${serverInfo}`);
});

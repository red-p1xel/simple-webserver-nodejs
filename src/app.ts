import { networkInterfaces } from 'os';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';

const app: Application = express();
let server: https.Server | http.Server;

dotenv.config();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world!');
});

if (
  !process.env?.SSL_KEY ||
  !process.env?.SSL_CERT ||
  (process.env.SSL_CERT || process.env.SSL_KEY) === 'null'
) {
  server = http.createServer({}, app);
} else {
  server = https.createServer(
    {
      key: fs.readFileSync(process.env.SSL_KEY, 'utf-8'),
      cert: fs.readFileSync(process.env.SSL_CERT, 'utf-8')
    },
    app
  );
}

server.listen(process.env.PORT, () => {
  const protocol: string = server instanceof https.Server ? 'https' : 'http';
  const serverIp = Object.values(networkInterfaces())
    .reverse()
    .flat()
    .find((ni) => ni?.family === 'IPv4' && !ni?.internal)?.address;

  const serverInfo = `${protocol}://${serverIp}:${process.env.PORT} and ${protocol}://127.0.0.1:${process.env.PORT}`;

  console.info(`>> Server started at ${serverInfo}`);
});

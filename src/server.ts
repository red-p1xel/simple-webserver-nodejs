import { networkInterfaces } from 'os';
import * as https from 'https';
import { Application } from 'express';
import { keyPairVerifier, ServerKeys } from './utils';
import { FileData } from './fileLoad';

export function start(app: Application, keys: FileData<string, Buffer>[]) {
  if (keys.length >= 2) {
    const verifiedKeys: ServerKeys = keyPairVerifier(keys);
    if (verifiedKeys.key && verifiedKeys.cert) {
      const server: https.Server = https.createServer(
        { key: verifiedKeys.key, cert: verifiedKeys.cert },
        app
      );
      server
        .listen(process.env.PORT, () => {
          const serverIp = Object.values(networkInterfaces())
            .reverse()
            .flat()
            .find((ni) => ni?.family === 'IPv4' && !ni?.internal)?.address;

          const serverInfo = `https://${serverIp}:${process.env.PORT} and https://127.0.0.1:${process.env.PORT}`;
          console.info(`--::::--[ Server started at ${serverInfo}`);
        })
        .on('request', (request, response) => {
          request.on('end', () => {
            console.info(
              `--::::--${request.socket.remoteAddress} - [ ${request.method} ] - "${request.url}" - ${response.statusCode}`
            );
          });
        });
    }
  }
}

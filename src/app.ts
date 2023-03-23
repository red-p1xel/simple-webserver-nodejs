import { loadFiles } from './fileLoad';
import { start } from './server';
import express, { Application, Request, Response } from 'express';

const app: Application = express();
loadFiles('.', ['pem']).then((keys) => {
  return start(app, keys);
});

app.get('/', (request: Request, response: Response) =>
  response.send('--`.++.`-- Hello world!')
);

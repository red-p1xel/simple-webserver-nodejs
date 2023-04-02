import { loadFiles } from './fileLoad';
import { start } from './server';
import express, { Application, Request, Response } from 'express';

const app: Application = express();
loadFiles('.', ['pem'])
  .then((keys) => {
    if (!keys.length) {
      throw new Error("Key files doesn't exist!");
    }
    return start(app, keys);
  })
  .catch((error) => {
    console.error(error.message);
  });

app.get('/', (request: Request, response: Response) =>
  response.send("Hello world!")
);

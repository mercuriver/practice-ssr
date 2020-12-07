import express from 'express';
import fs from 'fs';
import path from 'path';
import { renderToString } from 'react-dom/server';
import React from 'react';
import * as url from "url";
import { ServerStyleSheet } from 'styled-components';
import App from './App';
import { renderPage, prerenderPages } from './common';

const app = express();

const prerenderHtml = {};
for (const page of prerenderPages) {
  const pageHtml = fs.readFileSync(
    path.resolve(__dirname, `../dist/${page}.html`),
    'utf8'
  );
  prerenderHtml[page] = pageHtml;
}

app.use('/dist', express.static('dist'));
app.get('/favicon.ico', (req, res) => res.sendStatus(204));
app.get('*', (req, res ) => {
  const parsedUrl = url.parse(req.url, true);
  const page = parsedUrl.pathname !== '/' ? parsedUrl.pathname.substr(1) : 'home';
  const sheet = new ServerStyleSheet();
  const renderString = renderToString(sheet.collectStyles(<App page={page} />));
  const styles = sheet.getStyleTags();
  const initialData = {page};

  const pageHtml = prerenderPages.includes(page) 
    ? prerenderHtml[page]
    : renderPage(page);

  const result = pageHtml.replace( 
    '__DATA_FROM_SERVER__', JSON.stringify(initialData)
  );
  res.send(result);
});
app.listen(3000);
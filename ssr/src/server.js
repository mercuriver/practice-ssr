import express from 'express';
import fs from 'fs';
import path from 'path';
import { renderToString } from 'react-dom/server';
import React from 'react';
import * as url from "url";
import { ServerStyleSheet } from 'styled-components';
import App from './App';
import { renderPage, prerenderPages } from './common';
import lruCache from 'lru-cache';

const app = express();
const ssrCache = new lruCache({
  max: 100,
  maxAge: 1000 * 60
});
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
  const cacheKey = parsedUrl.path;
  if(ssrCache.has(cacheKey)) {
    console.log('Use cache');
    res.send(ssrCache.get(cacheKey));
    return;
  }
  const page = parsedUrl.pathname !== '/' ? parsedUrl.pathname.substr(1) : 'home';
  // const sheet = new ServerStyleSheet();
  // const renderString = renderToString(sheet.collectStyles(<App page={page} />));
  // const styles = sheet.getStyleTags();
  const initialData = {page};
  const pageHtml = prerenderPages.includes(page) 
    ? prerenderHtml[page]
    : renderPage(page);
  const result = pageHtml.replace( 
    '__DATA_FROM_SERVER__', JSON.stringify(initialData)
  );

  ssrCache.set(cacheKey, result);
  res.send(result);
});
app.listen(3000);
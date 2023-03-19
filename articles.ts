import * as jsdom from 'jsdom';
import fs from 'node:fs';
import { type ArticleInfo } from './types';

let currentLength = 100;
let totalLength = 0;
let lastSearch = '';

const articles = new Map<string, ArticleInfo>();

function callback() {
  fetch(`https://artofproblemsolving.com/wiki/index.php/Special:AllPages?from=${lastSearch}&to=&namespace=0`, {
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
    },
  })
    .then((res) => res.text())
    .then(async (html) => {
      const frag = jsdom.JSDOM.fragment(html);
      const ul = frag.querySelector('#mw-content-text > div.mw-allpages-body > ul')!;
      if (!ul) {
        fs.writeFileSync('articles.json', JSON.stringify([...articles.values()]));
        return;
      }
      console.log(ul.children.length);
      currentLength = ul.children.length;
      lastSearch = ul.children[ul.children.length - 1].textContent!.trim();
      for (const li of ul.children) {
        if (!li) continue;
        articles.set(li.textContent!.trim(), {
          title: li.textContent!.trim(),
          url: li.querySelector('a')!.href,
        });
      }
      console.log(currentLength, totalLength, lastSearch);
      totalLength += currentLength;
      setTimeout(callback, 1000);
    });
}

callback();

import * as fs from 'node:fs';
import { promisify } from 'node:util';
import { type ArticleInfo } from './types';
import * as jsdom from 'jsdom';
import * as path from 'node:path';
import { URL } from 'node:url';

const writeFilePromise = promisify(fs.writeFile);

const articleValues: ArticleInfo[] = JSON.parse(fs.readFileSync('./articles.json', 'utf-8'));

const images = new Map<string, string>();

function downloadFile(url, outputPath) {
  return fetch(url.replace(/^\/\//, 'https://'))
    .then((x) => x.arrayBuffer())
    .then((x) => writeFilePromise(outputPath, Buffer.from(x)));
}

async function evaluateArticles(idx) {
  if (idx == articleValues.length) return;
  process.stdout.write(`fetching ${articleValues[idx].title}...`);
  try {
    fetch(new URL(articleValues[idx].url, 'https://artofproblemsolving.com'), {
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.text();
      })
      .then((html) => {
        console.log('done');
        const frag = jsdom.JSDOM.fragment(html);
        process.stdout.write('images');
        for (const img of frag.getElementById('main-column')!.children[0].querySelectorAll('img')) {
          if (images.get(img.src)) {
            img.src = '/' + images.get(img.src)!;
            continue;
          }
          const hash = `images/${new Date().getTime()}${Math.random()}${path.extname(img.src)}`;
          process.stdout.write('.');
          downloadFile(img.src, `./${hash}`);
          images.set(img.src, hash);
          img.src = `/${hash}`;
        }
        process.stdout.write('done\n');
        try {
          fs.mkdirSync(`.${articleValues[idx].url}`, { recursive: true });
        } catch (e) {
          console.log(`fail, ${articleValues[idx].title}`);
          setTimeout(() => evaluateArticles(idx + 1), 500);
          return;
        }
        console.log('success', articleValues[idx].title, idx);
        fs.writeFileSync(`.${articleValues[idx].url}/index.html`, frag.querySelector('#main-column > div.page-wrapper')!.innerHTML);
        setTimeout(() => evaluateArticles(idx + 1), 500);
      });
  } catch (e) {
    console.log(e, 'Retrying in 5 seconds...');
    setTimeout(() => evaluateArticles(idx), 5000);
  }
}

evaluateArticles(14121);

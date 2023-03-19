import { execFile } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

execFile('find', ['wiki/', '-type', 'f'], function (_err, stdout, _stderr) {
  const file_list = stdout.split('\n');

  for (const file of file_list) {
    if (!file.endsWith('/index.html')) continue;
    writeFileSync(file, `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${readFileSync(file, 'utf-8')}</body></html>`);
  }
});

# `aops-offline`

This is a simple script that downloads everything on the AoPS wiki.

**Disclaimer**: This web scraping script is solely for educational purposes and should not be used for any other purpose. The author does not endorse or condone the use of this script for any illegal or unethical activities. Please use this script responsibly and in accordance with all applicable laws and regulations.

## Todo

I still need to figure out error handling, because every now and then when the request fails, the whole script crashes.

## Usage

Make sure you have Node.js 18 or higher installed, and PNPM installed globally. Then install dependencies:

```bash
pnpm install
```

There are four scripts:

- `articles` - Downloads all articles titles and URLs from the `Special:AllPages` in the wiki.
- `content` - Retrieves the content of all articles in the `articles.json` file, also adds images.
- `sanitize` - Sanitizes the HTML of all downloaded articles.
- `search` - Runs a search query using `grep` and `sed` on the articles.

Prefix scripts with `pnpm run` to run them, e.g. `pnpm run articles`.

## Build Output

You can preview the build output by running a local server:

```bash
python -m http.server
```

The images are automatically resolved to the `images` folder. The `wiki` contains all the HTML. The `articles.json` contains a list of all articles. The `search` scripts outputs a list of all article URLs into the `results.txt` file.

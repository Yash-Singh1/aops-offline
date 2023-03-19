import { exec } from 'node:child_process';

// We ask:
// - the search term
// - exclude or include
// - the option for exclude or include
// - previews or not

import('inquirer').then(({ default: inquirer }) => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'searchTerm',
        message: 'What do you want to search for?',
      },
      {
        name: 'excludeOrInclude',
        type: 'checkbox',
        message: 'Do you want to exclude or include something?',
        choices: [
          { name: 'Exclude', value: 'exclude' },
          { name: 'Include', value: 'include' },
        ],
        pageSize: 2,
      },
      {
        type: 'input',
        name: 'excludeOption',
        message: 'What do you want to exclude?',
        when(answers) {
          return answers.excludeOrInclude.includes('exclude');
        },
      },
      {
        type: 'input',
        name: 'includeOption',
        message: 'What do you want to include?',
        when(answers) {
          return answers.excludeOrInclude.includes('include');
        },
      },
      {
        type: 'confirm',
        name: 'previews',
        message: 'Do you want to see previews?',
      },
    ])
    .then((answers) => {
      let cmd = `grep -Fie "${answers.searchTerm}" -${!answers.previews ? 'l' : ''}r \`find wiki -type f ${
        answers.excludeOrInclude.includes('exclude') ? ` | grep -iv ${answers.excludeOption}` : ''
      } ${
        answers.excludeOrInclude.includes('include') ? ` | grep -i ${answers.includeOption}` : ''
      }\` | sed "s#^#http://localhost:8000/#" > results.txt`;
      exec(cmd, () => {
        console.log('Done! You can see the results at results.txt');
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

const childProcess = require('child_process');

module.exports = {

  editChangelog: true,
  editVersion: true,

  updateVersion: (cwd, version, callback) => {
    childProcess.execSync(`git commit -a -m "v${version}"`, { cwd });
    childProcess.execSync(`git tag -a ${version} -m ${version}`, { cwd });
    return callback();
  },

  addEntryToChangelog: {
    preset: 'prepend',
    fromLine: 5
  },

  getIncrementLevelFromCommit: (commit) => {
    return commit.footer['Change-Type'];
  },

  transformTemplateData: (data) => {
    data.features = data.commits.filter((commit) => {
      return commit.subject.startsWith('feat:');
    }).map((commit) => {
      return {
        message: commit.subject.slice(6),
        author: commit.footer['Signed-off-by']
      };
    });

    data.fixes = data.commits.filter((commit) => {
      return commit.subject.startsWith('fix:');
    }).map((commit) => {
      return {
        message: commit.subject.slice(5),
        author: commit.footer['Signed-off-by']
      };
    });

    return data;
  },

  template: [
    '## v{{version}} - {{moment date "Y-MM-DD"}}',
    '{{#if features.length}}',
    '',
    '### Features',
    '',
    '{{#each features}}',
    '- {{capitalize this.message}} (by {{this.author}})',
    '{{/each}}',
    '{{/if}}',
    '{{#if fixes.length}}',
    '',
    '### Fixes',
    '',
    '{{#each fixes}}',
    '- {{capitalize this.message}} (by {{this.author}})',
    '{{/each}}',
    '{{/if}}'
  ].join('\n')

};

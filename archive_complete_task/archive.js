const fs = require('fs');

const taskFilePath = 'task.md';
const tempUpdateFilePath = 'task_update.md';
const archiveFilePath = 'task_archive.md';

process.chdir('workdir');

const input = fs.createReadStream(taskFilePath);
const output = fs.createWriteStream(tempUpdateFilePath, { flags: 'w' });
const archive = fs.createWriteStream(archiveFilePath, { flags: 'a' });

// const taskLineRegex = /^\s*\[([ xX])\]\s.*/;
const completedTaskLineRegex = /^\s*-\s*\[\s*([xX])\s*\]\s.*/;
const lineBlankRegex = /^[\s\t]+/;
const taskLineRegex = /^-\s\[( |x)\]/;
const today = new Date();
const dateString = today.toLocaleDateString({ timeZone: 'Asia/Tokyo' });
console.log(dateString);
archive.write('## ' + dateString + '\n');

input.on('data', (chunk) => {
  const lines = chunk.toString().split('\n');
  for (const line of lines) {
    let level;
    let stack = [];

    if(taskLineRegex.test(line)) {

    }

    if (completedTaskLineRegex.test(line)) {
      archive.write(line + '\n');
    } else {
      output.write(line + '\n');
    }
  }
});

input.on('end', () => {
  output.end();
  archive.end();

  fs.unlink(taskFilePath, (err) => {
    if (err) throw err;
  });
  fs.rename(tempUpdateFilePath, taskFilePath, (err) => {
    if (err) throw err;
  });
});



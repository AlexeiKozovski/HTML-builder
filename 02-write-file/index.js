const fs = require ('fs');
const path = require('path');
const { stdin, stdout } = process;
const readline = require('readline');

const filePath = path.join(__dirname, 'text_file.txt');
const writeStream = fs.createWriteStream(filePath, 'utf-8');

process.on('SIGINT', () => {
  stdout.write('Всего доброго!');
  process.exit();
});

stdout.write('Приветствую! Можем начинать печатать.\n');

const rl = readline.createInterface({ input: stdin});

rl.on('line', (input) => {
  if (input.toString().trim() === 'exit'){
    rl.close();
    process.emit('SIGINT');
  } else {
    writeStream.write(input + '\n')
  }
});
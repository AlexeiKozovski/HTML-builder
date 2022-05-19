const fs = require('fs');
const path = require('path');
const { stdout, stderr } = process;

const filePath = path.join(__dirname, 'text.txt');
const read = fs.createReadStream(filePath, 'utf-8');

let text = '';

read.on('data', chunk => text += chunk);
read.on('end', () => stdout.write(text));
read.on('error', (error) => stderr.write('Error', error.message));
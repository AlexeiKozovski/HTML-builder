const fs = require('fs');
const path = require('path');
const {readdir} = require('fs/promises');
const { stderr } = process;

const stylePath = path.join(__dirname, 'styles');

async function mergeStyles(dirPath){
  const files = await readdir(dirPath, {withFileTypes: true});
  const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), 'utf-8');
  files.forEach(file => {
    let filePath = path.join(dirPath, file.name);
    if (file.isFile() && path.parse(file.name).ext === '.css'){
      const arr = [];
      const readStream = fs.createReadStream(filePath, 'utf-8');
      readStream.on('data', chunk => arr.push(chunk));
      readStream.on('end', () => arr.forEach(elem => writeStream.write(elem + '\n')));
      // readStream.on('error', (error) => stderr.write('Error', error.message));
    }
  })
}

(async () => {
  try {
    await mergeStyles (stylePath);
  } catch (error) {
    stderr.write('Error', error.message);
  }
})();
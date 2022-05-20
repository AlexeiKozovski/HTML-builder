const fs = require('fs');
const path = require('path');
const { stdout, stderr } = process;

const folderPath = path.join(__dirname, '/secret-folder');

fs.readdir(folderPath, {withFileTypes: true}, (err, files) => {
  if (err) stderr.write(`Error: ${err}`);
  files.forEach((file) => {
    if (file.isFile()) {
      fs.stat(path.join(folderPath, file.name), (err, stats) => {
        if (err) stderr.write(`Error: ${err}`);        
        let fileName = path.parse(file.name).name;
        let fileExt = path.parse(file.name).ext.slice(1);
        stdout.write(`${fileName} - ${fileExt} - ${stats.size / 1024}kb\n`);
      });
    }
  })
})
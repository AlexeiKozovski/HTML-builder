const fs = require('fs/promises');
const path = require('path');

const dirPath = path.join(__dirname, 'files');
const dirCopyPath = path.join(__dirname, 'files-copy');

async function dirCopy (dirPath, dirCopyPath) {
  await fs.mkdir(dirCopyPath, { recursive: true});
  const readCopyDir = await fs.readdir(dirCopyPath);
  readCopyDir.forEach(async file => {
    fs.access(path.join(dirPath, file)).catch(() => {
      fs.rm(path.join(dirCopyPath, file), { recursive: true})
    });
  });

  const readDir = await fs.readdir(dirPath, {withFileTypes: true});
  readDir.forEach(async file => {
    if(file.isFile()){
      fs.copyFile(path.join(dirPath, file.name), path.join(dirCopyPath, file.name))
    };
  });
};

dirCopy(dirPath, dirCopyPath);

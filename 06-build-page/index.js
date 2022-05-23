const fs = require('fs');
const path = require('path');
const { stderr } = process;
const { readFile, writeFile, readdir, copyFile, rm, mkdir } = require('fs/promises');

const distPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const distStylesPath = path.join(distPath, 'style.css');
const assetsPath = path.join(__dirname, 'assets');
const distAssetsPath = path.join(distPath, 'assets');

async function buildHtml(dirPath, components, dirTarget) {
  try {
    let template = await readFile(dirPath, 'utf-8');
    const tags = template.match(/{{\w*}}/g);
    const replaceTags = await Promise.all(
      tags.map(tag => {
        return readFile(path.join(components, `/${tag.slice(2, -2)}.html`), 'utf-8');
      })
    );
    replaceTags.forEach(item => {
      template = template.replace(/{{\w*}}/, item);
    });
    await writeFile(path.join(dirTarget, 'index.html'), template, 'utf-8');
  } catch (error) {
    stderr.write('Error', error.message);
  }
}

async function mergeStyles(dirPath, dirTarget){
  const files = await readdir(dirPath, { withFileTypes: true });
  const writeStream = fs.createWriteStream(dirTarget, 'utf-8');
  files.forEach(file => {
    let filePath = path.join(dirPath, file.name);
    if (file.isFile() && path.parse(file.name).ext === '.css'){
      const arr = [];
      const readStream = fs.createReadStream(filePath, 'utf-8');
      readStream.on('data', chunk => arr.push(chunk));
      readStream.on('end', () => arr.forEach(elem => writeStream.write(elem + '\n')));      
    }
  });
}

async function dirCopy (dirPath, dirTarget) {
  await mkdir(dirTarget, { recursive: true });
  const readCopyDir = await readdir(dirTarget);
  readCopyDir.forEach(async file => {
    fs.access(path.join(dirPath, file)).catch(() => {
      rm(path.join(dirTarget, file), { recursive: true });
    });
  });

  const readDir = await readdir(dirPath, { withFileTypes: true });
  readDir.forEach(async file => {
    if(file.isFile()){
      copyFile(path.join(dirPath, file.name), path.join(dirTarget, file.name));
    }
    if(file.isDirectory()) {
      dirCopy(path.join(dirPath, file.name), path.join(dirTarget, file.name));
    }
  });
}

async function buildPage() {
  await rm(distPath, { recursive: true, force: true });
  await mkdir(distPath, { recursive: true });
  await mkdir(distAssetsPath, { recursive: true });
  buildHtml(templatePath, componentsPath, distPath);
  mergeStyles(stylesPath, distStylesPath);
  dirCopy(assetsPath, distAssetsPath);
}

( async () => {
  try {
    await buildPage();
  } catch (error) {
    stderr.write('Error', error.message);
  }
})();
// Configurable
const projectName = require('../package.json').name;
const projectVersion = require('../dist/manifest.json').version;
const archiveNameBuild = `${projectName}_${projectVersion}_build.zip`;
const archiveNameSource = `${projectName}_${projectVersion}_source.zip`;
const archiveSourceExclude = [/^output$/, /^dist$/, /^node_modules$/, /^\.git$/];


// Logic (Don't touch, if you don't understand)
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

function archive({ cleanOutput, rootPath, outputFolder, fileName, targetFolderPath, exclude }) {
  const formatName = 'zip';
  const root = path.resolve(__dirname, rootPath);
  const outputFolderPath = path.resolve(root, outputFolder || '');
  const targetFolder = path.resolve(root, targetFolderPath || '');
  const outputFilePath = path.resolve(outputFolder, fileName || ('unnamed.' + formatName));

  if (cleanOutput) {
    fs.rmdirSync(outputFolderPath, { recursive: true });
  }
  fs.mkdirSync(outputFolderPath, { recursive: true });

  const output = fs.createWriteStream(outputFilePath);
  const arc = archiver(formatName, {
    zlib: { level: 9 } // Sets the compression level.
  });
  arc.on('warning', (err) => { if (err.code === 'ENOENT') return console.warn(err); throw err; });
  arc.on('error', (err) => { throw err; });
  output.on('close', () => {
    const size = arc.pointer();
    const sizeKb = (size / 1024).toFixed(0) + '.' + (size % 1024);
    console.log(`\t${fileName} :\t${sizeKb} Kb`);
  });

  arc.pipe(output);
  fs.readdirSync(targetFolder).forEach(name => {
    if (Array.isArray(exclude) && exclude.some(re => re.test(name))) return;
    const pathToFile = path.resolve(targetFolder, name);
    const isFolder = fs.lstatSync(pathToFile).isDirectory();
    if (isFolder) {
      arc.directory(pathToFile, name);
    } else {
      arc.file(pathToFile, { name });
    }
  });
  arc.finalize();
}

archive({
  cleanOutput: true,
  rootPath: '../',
  outputFolder: 'output',
  fileName: archiveNameBuild,
  targetFolderPath: 'dist',
});
archive({
  rootPath: '../',
  outputFolder: 'output',
  fileName: archiveNameSource,
  exclude: archiveSourceExclude,
});
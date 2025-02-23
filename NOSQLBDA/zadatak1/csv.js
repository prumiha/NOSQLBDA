const fs = require('fs');
const { parse } = require('csv-parse');
const { stringify } = require('csv-stringify');

async function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const records = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true }))
      .on('data', (data) => records.push(data))
      .on('end', () => resolve(records))
      .on('error', (error) => reject(error));
  });
}

async function createCSV(filePath, data) {
  return new Promise((resolve, reject) => {
    stringify(data, { header: true }, (err, output) => {
      if (err) {
        return reject(err);
      }
      fs.writeFile(filePath, output, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

module.exports = {
  readCSV,
  createCSV
};
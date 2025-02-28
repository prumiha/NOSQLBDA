const CATEGORICAL_FIELDS = ['subject', 'condition', 'replication', 'leg', 'joint', 'time'];
const CONTINUOUS_FIELD = 'angle';

function verifyData(data) {
  let categoricalErrors = 0;
  let continuousErrors = 0;

  // Kako se kontinuirana varijabla (angle) oznacava kut pod kojim se zglob nalazi, a kut 
  // moze poprimiti i negativnu vrijednost, kontinuirane varijable se zamjenjuju sa -9999.
  // Kategoricke varijable se zamjenjuju sa 'empty'.
  const verifiedData = data.map(record => {
    const verifiedRecord = {};
    for (const key in record) {
      if (CATEGORICAL_FIELDS.includes(key)) {
        if (record[key] === null || record[key] === undefined || record[key] === '') {
          verifiedRecord[key] = 'empty';
          categoricalErrors++;
        } else {
          verifiedRecord[key] = record[key];
        }
      } else if (key === CONTINUOUS_FIELD) {
        if (isNaN(record[key]) || record[key] === null || record[key] === undefined || record[key] === '') {
          verifiedRecord[key] = -9999;
          continuousErrors++;
        } else {
          verifiedRecord[key] = parseFloat(record[key]);
        }
      }
    }
    return verifiedRecord;
  });

console.log(`Podaci iz gait.csv su provjereni i ispravljeni. Kategoricke greske: ${categoricalErrors}, Kontinuirane pogreske: ${continuousErrors}`);

  return verifiedData;
}

module.exports = verifyData;
const CATEGORICAL_FIELDS = ['subject', 'condition', 'replication', 'leg', 'joint', 'time'];
const CONTINUOUS_FIELD = 'angle';

function verifyData(data) {
  let categoricalErrors = 0;
  let continuousErrors = 0;

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

console.log(`Data from gait.csv is verified and corrected. Categorical errors: ${categoricalErrors}, Continuous errors: ${continuousErrors}`);

  return verifiedData;
}

module.exports = verifyData;
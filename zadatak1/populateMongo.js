const { v4: uuidv4 } = require('uuid');

async function populateMongo(db, data) {
  const collection = db.collection('gait');

  try {
    await collection.deleteMany({});
    const documents = data.map(record => ({
      _id: uuidv4(),
      ...record
    }));
    await collection.insertMany(documents);
    console.log('Podaci su uspješno uneseni u MongoDB');
  } catch (error) {
    console.error('Greska pri unosu podataka u MongoDB', error);
  }
}

module.exports = populateMongo;
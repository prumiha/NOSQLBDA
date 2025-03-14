const { v4: uuidv4 } = require('uuid');

async function splitStatistics(db) {
  const collection = db.collection('gait');
  const statsCollection = db.collection('statistika_gait');

  const stats = await statsCollection.findOne({});
  if (!stats) {
    console.log('U kolekciji "statistika_gait" nedostaje dokument iz kojeg je potrebno izvući prosječnu vrijednost.');
    return;
  }

  const meanValue = stats['Srednja vrijednost'];

  const lessThanOrEqualToMean = await collection.find({ angle: { $ne: -9999, $lte: meanValue } }).toArray();
  const greaterThanMean = await collection.find({ angle: { $ne: -9999, $gt: meanValue } }).toArray();

  const stats1CollectionName = 'statistika1_gait';
  const stats2CollectionName = 'statistika2_gait';
  const stats1Collection = db.collection(stats1CollectionName);
  const stats2Collection = db.collection(stats2CollectionName);
  await stats1Collection.deleteMany({});
  await stats2Collection.deleteMany({});

  await stats1Collection.insertMany(lessThanOrEqualToMean.map(record => ({ _id: uuidv4(), angle: record.angle })));
  await stats2Collection.insertMany(greaterThanMean.map(record => ({ _id: uuidv4(), angle: record.angle })));

  console.log(`Dokumenti su umetnuti u kolekcije: '${stats1CollectionName}' i '${stats2CollectionName}'`);
}

module.exports = splitStatistics;
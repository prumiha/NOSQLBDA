const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const continuousStatsCollectionName = 'statistika_gait';
const categoricalStatsCollectionName = 'frekvencija_gait';

async function calculateContinuousStatistics(db) {
  const collection = db.collection('gait');

  const pipeline = [
    { $match: { angle: { $ne: -9999 } } },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        mean: { $avg: "$angle" },
        sumOfSquares: { $sum: { $pow: ["$angle", 2] } }
      }
    },
    {
      $project: {
        _id: 0,
        'Broj nomissing elemenata': "$count",
        'Srednja vrijednost': "$mean",
        'Standardna devijacija': {
          $sqrt: {
            $divide: [
              { $subtract: ["$sumOfSquares", { $multiply: ["$mean", "$mean", "$count"] }] },
              "$count"
            ]
          }
        },
        Varijabla: "angle"
      }
    }
  ];

  const stats = await collection.aggregate(pipeline).toArray();

  if (stats.length === 0) {
    console.log('No valid data found for statistics calculation.');
    return;
  }

  const statistics = {
    _id: uuidv4(),
    ...stats[0]
  };
  const statsCollection = db.collection(continuousStatsCollectionName);

  await statsCollection.deleteMany({});
  await statsCollection.insertOne(statistics);

  console.log(`Kontinuirane statistike umetnute u kolekciju: '${continuousStatsCollectionName}'`);
}

async function calculateCategoricalStatistics(db) {
  const collection = db.collection('gait');
  const categoricalFields = ['subject', 'condition', 'replication', 'leg', 'joint', 'time'];

  const frequencies = {};

  for (const field of categoricalFields) {
    const fieldPipeline = [
      { $match: { [field]: { $ne: 'empty' } } },
      { $group: { _id: `$${field}`, count: { $sum: 1 } } }
    ];

    const results = await collection.aggregate(fieldPipeline).toArray();
    frequencies[field] = results.reduce((acc, result) => {
      acc[result._id] = result.count;
      return acc;
    }, {});
  }

  const frequencyDocuments = categoricalFields.map(field => ({
    _id: uuidv4(),
    Varijabla: field,
    Pojavnost: frequencies[field]
  }));

  const freqCollection = db.collection(categoricalStatsCollectionName);

  await freqCollection.deleteMany({});
  await freqCollection.insertMany(frequencyDocuments);

  console.log(`Kategorijske statistike umetnute u kolekciju: '${categoricalStatsCollectionName}'`);
}

async function calculateCategoricalStatisticsWithInc(db) {
  const collection = db.collection('gait');
  const categoricalFields = ['subject', 'condition', 'replication', 'leg', 'joint', 'time'];
  const freqCollection = db.collection(categoricalStatsCollectionName);

  await freqCollection.deleteMany({});

  for (const field of categoricalFields) {
    const cursor = collection.find({ [field]: { $ne: 'empty' } });

    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      const value = doc[field];

      await freqCollection.updateOne(
        { Varijabla: field },
        { $inc: { [`Pojavnost.${value}`]: 1 } },
        { upsert: true }
      );
    }
  }

  console.log(`Kategorijske statistike izračunate s $inc umetnute su u kolekciju: '${categoricalStatsCollectionName}'`);
}

module.exports = {
  calculateContinuousStatistics,
  calculateCategoricalStatistics,
  calculateCategoricalStatisticsWithInc
};
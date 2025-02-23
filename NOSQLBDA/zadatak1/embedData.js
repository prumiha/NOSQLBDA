async function embedCategoricalData(db) {
  const data = await db.collection('gait').find().toArray();
  const categoricalData = await db.collection('frekvencija_gait').find().toArray();
  const embCollection = db.collection('emb_gait');

  await embCollection.deleteMany({});

  const embededDocuments = data.map(document => {
    document["category"] = {};

    for (let data of categoricalData) {
      const field = data.Varijabla;
      document["category"][field] = data.Pojavnost;
    }

    return document;
  });

  await embCollection.insertMany(embededDocuments);

  console.log(`Documents with embedded categorical data inserted into collection: 'emb_gait'`);
}

async function embedContinuousData(db) {
    const data = await db.collection('gait').find().toArray();
    const continuousData = await db.collection('statistika_gait').find().toArray();
    const embCollection = db.collection('emb2_gait');
  
    await embCollection.deleteMany({});
  
    const embededDocuments = data.map(document => {
      document["continuous"] = continuousData;
  
      return document;
    });
  
    await embCollection.insertMany(embededDocuments);
  
    console.log(`Documents with embedded continuous data inserted into collection: 'emb2_gait'`);
  }

module.exports = {
  embedCategoricalData,
  embedContinuousData
};
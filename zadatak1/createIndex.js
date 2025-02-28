const { connectToDatabase } = require('./mongo');

async function createIndexAndQuery() {
    const db = await connectToDatabase();
    const collection = db.collection('gait');

    await collection.createIndex({ angle: 1, leg: 1, joint: 1 });
    const indexedQuery = { angle: { $gt: 0 }, leg: "1", joint: "2" };
    const halfIndexedQuery = { angle: { $gt: 0 }, leg: "1", condition: "2" };
    const notIndexedQuery = { replication: { $in: ["1", "2", "3", "4", "5"] }, subject: { $in: ["1", "2", "3", "4", "5"] }};

    // Vrijeme potrebno za izvrsavanje poziva
    const halfIndexedQueryStartTime = process.hrtime();
    const halfIndexedData = await collection.find(halfIndexedQuery).toArray();
    const halfIndexedQueryEndTime = process.hrtime(halfIndexedQueryStartTime);
    const halfIndexedQueryExecutionTime = halfIndexedQueryEndTime[0] * 1000 + halfIndexedQueryEndTime[1] / 1000000;

    const indexedQueryStartTime = process.hrtime();
    const indexedData = await collection.find(indexedQuery).toArray();
    const indexedQueryEndTime = process.hrtime(indexedQueryStartTime);
    const indexedQueryExecutionTime = indexedQueryEndTime[0] * 1000 + indexedQueryEndTime[1] / 1000000;

    const notIndexedQueryStartTime = process.hrtime();
    const notIndexedData = await collection.find(notIndexedQuery).toArray();
    const notIndexedQueryEndTime = process.hrtime(notIndexedQueryStartTime);
    const notIndexedQueryExecutionTime = notIndexedQueryEndTime[0] * 1000 + notIndexedQueryEndTime[1] / 1000000;

    console.log(`Vrijeme izvrsavanja - indeksirani upit: ${indexedQueryExecutionTime} ms, broj dokumenata: ${indexedData.length}`);
    console.log(`Vrijeme izvrsavanja - djelomicno indeksirani upit: ${halfIndexedQueryExecutionTime} ms, broj dokumenata: ${halfIndexedData.length}`);
    console.log(`Vrijeme izvrsavanja - neindeksirani upit: ${notIndexedQueryExecutionTime} ms, broj dokumenata: ${notIndexedData.length}`);

}

module.exports = createIndexAndQuery;
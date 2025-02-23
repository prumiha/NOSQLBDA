const { closeDatabaseConnection, connectToDatabase } = require('./mongo');
const { readCSV } = require('./csv');
const populateMongo = require('./populateMongo');
const verifyData = require('./verifyData');
const {calculateContinuousStatistics, calculateCategoricalStatistics, calculateCategoricalStatisticsWithInc} = require('./statistics');
const splitStatistics = require('./splitStatistics');
const { embedCategoricalData, embedContinuousData } = require('./embedData');

async function main() {
    const db = await connectToDatabase();

    // Read data from gait.csv
    const rawData = await readCSV('../data/gait.csv');

    // Verify data and replace missing values
    const data = verifyData(rawData);

    // Write data to MongoDB
    //await populateMongo(db, data);
    
    // Calculate statistics
    await calculateContinuousStatistics(db)
    await calculateCategoricalStatistics(db);
    // Using $inc is significantly slower due to the need to modify each document individually.
    //await calculateCategoricalStatisticsWithInc(db);

    // Split statistics
    await splitStatistics(db);

    // Embed data
    await embedCategoricalData(db);
    await embedContinuousData(db);


    closeDatabaseConnection();
}

main();
const { closeDatabaseConnection, connectToDatabase } = require('./mongo');
const { readCSV } = require('./csv');
const populateMongo = require('./populateMongo');
const verifyData = require('./verifyData');
const {calculateContinuousStatistics, calculateCategoricalStatistics, calculateCategoricalStatisticsWithInc} = require('./statistics');
const splitStatistics = require('./splitStatistics');
const { embedCategoricalData, embedContinuousData } = require('./embedData');
const createIndexAndQuery = require('./createIndex');

async function main() {
    // Spajanje na bazu i ucitavanje dataset-a
    const db = await connectToDatabase();
    const rawData = await readCSV('../data/gait.csv');


    // Zadatak 1
    // Sve nedostajuće vrijednosti kontinuirane varijable zamijeniti sa -1, a kategoričke sa „empty“.
    
    // Kako se kontinuirana varijabla (angle) oznacava kut pod kojim se zglob nalazi, a kut 
    // moze poprimiti i negativnu vrijednost, kontinuirane varijable kojima nedostaje vrijednost
    // se zamjenjuju sa -9999. Nedostajuce kategoricke varijable se zamjenjuju sa 'empty'.
    const data = verifyData(rawData);

    // Unos podataka u bazu
    //await populateMongo(db, data);
    
    // Zadatak 2
    // Za svaku kontinuiranu vrijednost izračunati srednju vrijednost, standardnu devijaciju i kreirati 
    // novi dokument oblika sa vrijednostima, dokument nazvati:  statistika_ {ime vašeg data seta}. 
    // U izračun se uzimaju samo nomissing  vrijednosti .
    await calculateContinuousStatistics(db)

    // Zadatak 3
    // Za svaku kategoričku  vrijednost izračunati frekvencije pojavnosti po obilježjima varijabli i 
    // kreirati novi dokument koristeći nizove,  dokument nazvati:  frekvencija_ {ime vašeg data seta}. 
    // Frekvencije računati koristeći $inc modifikator. 
    
    // Korištenje $inc modifikatora je značajno sporije jer radi na nacin da zahtijeva pojedinačnu izmjenu svakog dokumenta u bazi podataka.
    // Svaki put kada se koristi $inc, baza podataka mora pronaći odgovarajući dokument, zaključati ga,
    // izvršiti izmjenu i zatim otključati dokument. Ovaj proces je vrlo resursno intenzivan i može značajno
    // usporiti performanse, posebno kada se radi s velikim brojem dokumenata, u ovom slucaju 181800 dokumenata.
    //await calculateCategoricalStatisticsWithInc(db);
    await calculateCategoricalStatistics(db);
    

    // Zadatak 4
    // Iz osnovnog  dokumenta kreirati dva nova dokumenta sa kontinuiranim vrijednostima u kojoj će u prvom
    // dokumentu   biti sadržani svi elementi <= srednje vrijednosti , a u drugom dokumentu biti sadržani 
    // svi elementi >srednje vrijednosti , dokument nazvati:  statistika1_ {ime vašeg data seta} i 
    // statistika2_ {ime vašeg data seta}
    await splitStatistics(db);

    // Zadatak 5
    // Osnovni  dokument  kopirati u novi te embedati vrijednosti iz tablice 3 za svaku kategoričku 
    // vrijednost, :  emb_ {ime vašeg data seta}
    await embedCategoricalData(db);

    // Zadatak 6
    // Osnovni  dokument  kopirati u novi te embedati vrijednosti iz tablice 2 za svaku kontinuiranu
    // vrijednost kao niz :  emb2_ {ime vašeg data seta}
    await embedContinuousData(db);

    // Zadatak 7
    // Iz tablice emb2 izvući sve one srednje vrijednosti  iz  nizova čija je standardna devijacija 
    // 10% > srednje vrijednosti koristeći $set modifikator

    // Zadatak 8
    // Kreirati složeni indeks na originalnoj tablici i osmisliti upit koji je kompatibilan sa indeksom 
    await createIndexAndQuery();


    closeDatabaseConnection();
}

main();
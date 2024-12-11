const { Firestore } = require('@google-cloud/firestore');

async function  getAllData() {
    const db = new Firestore();
    const pred = db.collection('predictions');

    const allData = await pred.get();
    return allData;
}

module.exports = getAllData;
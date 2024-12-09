const { Firestore } = require('@google-cloud/firestore');
 
  const db = new Firestore({
    projectId: 'capstone-foodlergic',
    keyFilename: './serviceAccountKey.json',
  });

  async function storeData(id,data) {
    const pred = db.collection('predictions');
    return pred.doc(id).set(data);
  }
module.exports = db, storeData;
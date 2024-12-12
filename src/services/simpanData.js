const { Firestore } = require('@google-cloud/firestore');
 
  const db = new Firestore({
    projectId: 'capstone-foodlergic',
    keyFilename: './serviceAccountKey.json',
  });

  async function simpanData(id,data) {
    const predictCollection = db.collection('predictions');
    return predictCollection.doc(id).set(data);
  }
  
module.exports = {
  db, 
  simpanData,
};
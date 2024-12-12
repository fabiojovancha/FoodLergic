
const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');
const { db } = require("../services/simpanData");

async function predClassifications(model, imageBuffer, userId) {
    try {
        if (!userId) {
            throw new InputError('User ID is missing');
        }

        const tensor = tf.node
            .decodeImage(imageBuffer) 
            .resizeNearestNeighbor([299, 299]) 
            .expandDims() 
            .toFloat()
            .div(tf.scalar(255)); 

        const prediction = model.predict(tensor);
        const probabilities = await prediction.data(); 
        console.log('Probabilities:', probabilities);

        if (!probabilities || probabilities.length === 0) {
            throw new Error('Prediction output is empty');
        }

        const labelIndex = probabilities.indexOf(Math.max(...probabilities));
        console.log('Label Index:', labelIndex);

        const labels = { 
            0: 'telur', 1: 'kerang', 2: 'ayam', 3: 'gandum', 4: 'ikan', 
            5: 'kacang_kedelai', 6: 'Sapi', 7: 'wijen', 8: 'susu', 
            9: 'kacang_tanah', 10: 'udang', 11: 'coklat' 
        };

        const label = labels[labelIndex]; 
        console.log('Predicted Label:', label);

        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            throw new InputError('User not found');
        }

        const userData = userDoc.data();
        const allergies = userData.allergies || [];

        
        let suggestion;
        const allergyNames = allergies.map((allergy) => allergy.name);
        if (allergyNames.includes(label)) {
            suggestion = "Berbahaya, tidak dapat dikonsumsi";
        } else {
            suggestion = "Aman untuk dimakan";
        }

        return { label, suggestion };
    } catch (error) {
        console.error('Prediction Error:', error);
        throw new InputError('Gagal dalam melakukan prediksi');
    }
}

module.exports = predClassifications;


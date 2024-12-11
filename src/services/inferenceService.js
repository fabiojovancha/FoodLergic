const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');
 
async function predClassifications(model, image, userId) {
    try {
        // Validasi input
        if (!image) {
            throw new InputError('Image is missing');
        }

        if (!userId) {
            throw new InputError('User ID is missing');
        }

        // Preprocessing gambar
        const tensor = tf.node
            .decodeImage(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat()
            .div(tf.scalar(255)); // Normalisasi

        // Prediksi
        const prediction = model.predict(tensor);
        const predictionData = await prediction.data();
        const maxIndex = predictionData.indexOf(Math.max(...predictionData));
        const predictedLabel = classes[maxIndex]; // 'classes' adalah array label

        // Ambil data pengguna dari Firestore
        const userDoc = await firestore.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            throw new InputError('User not found');
        }

        const userData = userDoc.data();
        const allergies = userData.allergies || [];

        // Saran berdasarkan alergi
        const suggestion = allergies.includes(predictedLabel)
            ? 'Berbahaya, tidak dapat dikonsumsi'
            : 'Aman untuk dimakan';

        return { label: predictedLabel, suggestion };
    } catch (error) {
        console.error('Error during prediction:', error);
        throw new InputError('An error occurred while making the prediction');
    }
}

module.exports = predClassifications;
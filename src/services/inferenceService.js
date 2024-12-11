const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');
 
async function predClassifications(model, image, userId) {
    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat();

        const prediction = model.predict(tensor);
        const label = await prediction.data();

        const userDoc = await firestore.collection('users').doc(userId).get();

        const userData = userDoc.data();
        const allergies = userData.allergies || []; 
        let suggestion;

        if (allergies.includes(label)) {
            suggestion = "Berbahaya, tidak dapat dikonsumsi";
        } else {
            suggestion = "Aman untuk dimakan";
        }

        return { label, suggestion };
    } catch (error) {
        console.error(error);
        throw new InputError('An error occurred while making the prediction');
    }
}

module.exports = predClassifications;
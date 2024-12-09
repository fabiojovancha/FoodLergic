const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');
 
async function predClassifications(model, image, allergyFieldValues) {
    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat();

        const prediction = model.predict(tensor);
        const scores = await prediction.data(); 
        const topIndex = scores.indexOf(Math.max(...scores));
        const confidenceScore = scores[topIndex] * 100;

        const label = allergyFieldValues[topIndex];
        let suggestion;

        if (label === 'Allergy') {
            suggestion = "Jangan dimakan, berbahaya!";
        } else if (label === 'Non-Allergy') {
            suggestion = "Aman, dapat dimakan.";
        }

        return {
            label,
            suggestion,
            confidence: `${confidenceScore.toFixed(2)}%`,
        };
    } catch (error) {
        console.error("Error during prediction:", error);
        throw new InputError("Terjadi kesalahan dalam melakukan prediksi");
    }
}

module.exports = predClassifications;
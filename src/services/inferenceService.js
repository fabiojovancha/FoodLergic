const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');
 
async function  predClassifications(model, image) {
    try{
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224,224])
            .expandDims()
            .toFloat()
        
        const prediction = model.predict(tensor);
        const score = await prediction.data()
        const confidentScore = Math.max(...score) * 100;

        const label = confidentScore <= 50 ? 'Non-Allergy' : 'Allergy';
        let suggestion;

        if(label == 'Allergy'){
            suggestion = "Jangan dimakan, berbahaya !"
        }
        if(label == 'Non-Allergy'){
            suggestion = "Aman, dapat dimakan."
        }
        return(label,suggestion);
    }catch(error){
        throw new InputError('Terjadi kesalahan dalam melakukan prediksi')
    }    

}
// testModel.js
const tf = require('@tensorflow/tfjs-node');

const loadModel = async () => {
  const modelPath = 'file://./trained_model/model.json';
  const model = await tf.loadLayersModel(modelPath);
  console.log('Model loaded successfully');
  return model;
};

const predict = async (model, input) => {
    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const inputIndex = weekdays.indexOf(input);
    const inputTensor = tf.tensor2d([[inputIndex]]);
    const output = model.predict(inputTensor);
    const prediction = output.dataSync()[0];
  
    // Convert the normalized prediction back to a percentage
    const maxPercent = 1.00; // The maximum percentage used during normalization
    const predictedPercentage = prediction * maxPercent * 100;
  
    // Ensure the predicted percentage is within [0, 100] range
    const clampedPercentage = Math.min(Math.max(predictedPercentage, 0), 100);
  
    console.log(`Predicted likelihood of going to class on ${input}: ${clampedPercentage.toFixed(2)}%`);
  };

(async () => {
  const model = await loadModel();
  await predict(model, 'friday'); // Replace with the day you want to predict
})();

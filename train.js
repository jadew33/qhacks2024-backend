// // trainModel.js
// const tf = require("@tensorflow/tfjs-node");

// const generateDataset = (startDate, endDate) => {
//   const dataset = [];
//   const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"];

//   let currentDate = new Date(startDate);
//   const endDateObj = new Date(endDate);

//   while (currentDate <= endDateObj) {
//     const dateString = currentDate.toISOString().split("T")[0];
//     const weekday = weekdays[currentDate.getDay()];
//     const percent = Math.random(); // You can adjust this to generate random percentage values

//     dataset.push({ date: dateString, weekday, percent });

//     currentDate.setDate(currentDate.getDate() + 1);
//   }

//   return dataset;
// };

// const startDate = "2024-02-05";
// const endDate = "2024-05-05";

// const largerDataset = generateDataset(startDate, endDate);

// // Sample dataset
// const dataset = [
//   { date: "2024-02-05", weekday: "monday", percent: 0.6 },
//   { date: "2024-02-06", weekday: "tuesday", percent: 0.85 },
//   { date: "2024-02-07", weekday: "wednesday", percent: 1.0 },
//   { date: "2024-02-08", weekday: "thursday", percent: 0.85 },
//   { date: "2024-02-09", weekday: "friday", percent: 0.5 },
//   { date: "2024-02-12", weekday: "monday", percent: 0.3 },
//   { date: "2024-02-13", weekday: "tuesday", percent: 0.45 },
//   { date: "2024-02-14", weekday: "wednesday", percent: 1.0 },
//   { date: "2024-02-15", weekday: "thursday", percent: 0.9 },
//   { date: "2024-02-16", weekday: "friday", percent: 0.5 },
// ];

// // Preprocess the data with normalization
// const processData = (data) => {
//   const weekdays = Array.from(new Set(data.map((entry) => entry.weekday)));
//   const maxPercent = Math.max(...data.map((entry) => entry.percent));
//   const processedData = data.map((entry) => ({
//     input: [weekdays.indexOf(entry.weekday) / weekdays.length],
//     output: [entry.percent / maxPercent],
//   }));
//   return processedData;
// };

// const processedData = processData(largerDataset);

// // Define and compile the model
// const createModel = () => {
//   const model = tf.sequential();
//   model.add(
//     tf.layers.dense({ units: 64, inputShape: [1], activation: "relu" }),

//   );
//   model.add(tf.layers.dense({ units: 1, activation: "linear" }));
//   model.compile({ optimizer: 'sgd', loss: "meanSquaredError",  metrics: ['accuracy'] });
//   return model;
// };

// // Train the model
// const trainModel = async (model, data) => {
//   const xs = tf.tensor2d(data.map((entry) => entry.input));
//   const ys = tf.tensor2d(data.map((entry) => entry.output));

//   const validationSplit = 0.2;
//   const history = await model.fit(xs, ys, {
//     epochs: 200,
//     validationSplit,
//     callbacks: {
//       onEpochEnd: (epoch, logs) =>
//         console.log(`Epoch ${epoch + 1}/200, Loss: ${logs.loss}, Accuracy: ${logs.acc}`),
//     },
//   });

//   console.log("Model training complete");
// };

// // Save the trained model
// const saveModel = async (model) => {
//   await model.save("file://./trained_model");
//   console.log("Model saved");
// };

// // Run the training process
// (async () => {
//   generateDataset()
//   const processedData = processData(largerDataset);
//   const model = createModel();
//   await trainModel(model, processedData);
//   await saveModel(model);
// })();

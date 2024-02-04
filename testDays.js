const brain = require("brain.js");

// Sample dataset
const dataset = [
  { date: "2024-02-05", weekday: "monday", percent: 0.6 },
  { date: "2024-02-06", weekday: "tuesday", percent: 0.85 },
  { date: "2024-02-07", weekday: "wednesday", percent: 1.0 },
  { date: "2024-02-08", weekday: "thursday", percent: 0.85 },
  { date: "2024-02-09", weekday: "friday", percent: 0.5 },
  { date: "2024-02-12", weekday: "monday", percent: 0.3 },
  { date: "2024-02-13", weekday: "tuesday", percent: 0.45 },
  { date: "2024-02-14", weekday: "wednesday", percent: 1.0 },
  { date: "2024-02-15", weekday: "thursday", percent: 0.9 },
  { date: "2024-02-16", weekday: "friday", percent: 0.5 },
];

// Preprocess data and create input-output pairs
const trainingData = dataset.map((data, index) => {
  const input = {
    weekday: encodeWeekday(data.weekday),
    historicalPercent: index > 0 ? dataset[index - 1].percent : 0, // Use previous day's percentage
  };
  const output = { percent: data.percent };
  return { input, output };
});

// Define a function to encode weekdays
function encodeWeekday(weekday) {
  switch (weekday.toLowerCase()) {
    case "monday":
      return 1;
    case "tuesday":
      return 2;
    case "wednesday":
      return 3;
    case "thursday":
      return 4;
    case "friday":
      return 5;
    default:
      return 0; // Handle other cases if necessary
  }
}

// Define and train the neural network
const net = new brain.NeuralNetwork();

net.train(trainingData);

// Define weekdays
const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"];

// Start from the day after the last day in the dataset
let lastDayIndex = weekdays.indexOf(
  dataset[dataset.length - 1].weekday.toLowerCase()
);
let lastDayPercent = dataset[dataset.length - 1].percent;

// Predict for the next 5 weekdays
for (let i = 1; i <= 5; i++) {
  let nextDayIndex = (lastDayIndex + i) % weekdays.length;
  let nextDay = weekdays[nextDayIndex];
  let nextDayEncoded = encodeWeekday(nextDay);

  let prediction = net.run({
    weekday: nextDayEncoded,
    historicalPercent: lastDayPercent,
  });

  console.log(
    `Predicted attendance percentage for ${nextDay}: ${prediction.percent}`
  );

  // Update lastDayPercent with the predicted percent
  lastDayPercent = prediction.percent;
}

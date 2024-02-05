const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const brain = require("brain.js");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json()); // for parsing application/json

const port = 5000;

https: main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to Mongo");
}

app.get("/", async (req, res) => {
  res.send("hello world!");
});

const UserModel = require("./Models/UserModel");

app.post("/user", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await UserModel.findOne({ email: email });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error fetching user" });
  }
});

app.post("/user/classes", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await UserModel.findOne({ email: email }, "classes");
    if (user) {
      res.status(200).json(user.classes);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error fetching user class data" });
  }
});

app.post("/user/closet", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await UserModel.findOne({ email: email }, "closet");
    if (user) {
      res.status(200).json(user.closet);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error fetching user closet data" });
  }
});

app.post("/user/friends", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await UserModel.findOne({ email: email }, "friends");
    if (user) {
      res.status(200).json(user.friends);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error fetching user friends data" });
  }
});

// BRAIN JS CODE BELOW ----

// Hardcoded attendance dataset
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

// posts the likelihood for the user to attend class on a given weekday
// based on prior attendance data. For now, the attendance data is hardcoded in
// as we do not have a real user's data to work with.
app.post("/user/prediction", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await UserModel.findOne({ email: email });

    if (user) {
      // Predict for the next 5 weekdays
      let predictions = [];
      for (let i = 1; i <= 5; i++) {
        let nextDayIndex = (lastDayIndex + i) % weekdays.length;
        let nextDay = weekdays[nextDayIndex];
        let nextDayEncoded = encodeWeekday(nextDay);

        let prediction = net.run({
          weekday: nextDayEncoded,
          historicalPercent: lastDayPercent,
        });

        // Update lastDayPercent with the predicted percent
        lastDayPercent = prediction.percent;

        // Add the predicted percent to the predictions array
        predictions.push(prediction.percent);
      }

      // Return the predictions array
      res.json(predictions);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error fetching user data" });
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

module.exports = app;

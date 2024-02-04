const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = 5000;

https: main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to Mongo");
}

app.get("/", async (req, res) => {
  res.send("hello world!");
});

const ical = require("ical");
const UserModel = require("./Models/UserModel");

// Function to parse the .ics file from the URL
function parseICS(url) {
  return new Promise((resolve, reject) => {
    ical.fromURL(url, {}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

app.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send({ message: "Error fetching users" });
  }
});

// Usage example
// const icsUrl =
//   "https://mytimetable.queensu.ca/timetable/MM/19CQW-MMWUT4LVGMP3XFK3RKAETLVOSGAVUZVDEQ6UBR4KIH2LQLETIFGA.ics";
// parseICS(icsUrl)
//   .then((data) => {
//     // Process the parsed data
//     for (const key in data) {
//       if (data.hasOwnProperty(key)) {
//         const event = data[key];
//         console.log("Event:", event.summary);
//         console.log("Start Time:", event.start);
//         console.log("End Time:", event.end);
//         console.log("Location:", event.location);
//         console.log("Description:", event.description);
//         console.log("---");
//       }
//     }
//   })
//   .catch((err) => {
//     console.error("Error parsing .ics file:", err);
//   });

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

module.exports = app;

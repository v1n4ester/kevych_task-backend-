const express = require("express");
const mongoose = require("mongoose");
const Trip = require("./models/trip");
const cors = require('cors')

const PORT = 4000;
const app = express();
app.use(cors())

app.use(express.urlencoded({ extended: true }));
app.use(express.json())


app.get("/api/trips", async (req, res) => {
  try {
    const query = Object.keys(req.query).find((el) => el === "sorting");
    if (query) {
      if (req.query[query] === "date") {
        const trips = await Trip.find();

        function compare(a, b) {
          const aTimeS = new Date(a.timeStart).getTime()
          const bTimeS = new Date(b.timeStart).getTime()
          if(a.timeStart === b.timeStart){
            const aTimeA = new Date(a.timeArrive).getTime()
            const bTimeA = new Date(b.timeArrive).getTime()
              return aTimeA - bTimeA
          }
          return aTimeS - bTimeS
          }

        const result = trips.sort(compare)

        res.json(result)
      } else if (req.query[query] === "alphabet") {
        const trips = await Trip.find();

        function compare(a, b) {
          if (a.fromCity < b.fromCity) {
            return -1;
          }
          if (a.fromCity > b.fromCity) {
            return 1;
          }
          if (a.fromCity === b.fromCity) {
            if (a.toCity > b.toCity) {
              return 1;
            }
            if (a.toCity < b.toCity) {
              return -1;
            }
          }
        }

        const result = trips.sort(compare);

        res.json(result);
      } else {
        const trips = await Trip.find();
        res.json(trips);
      }
    } else {
      const trips = await Trip.find();
      res.json(trips);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Check your fields",
    });
  }
});
app.post("/api/trip", async (req, res) => {
  try {
    const trip = new Trip({
      fromCity: req.body.fromCity,
      toCity: req.body.toCity,
      timeStart: req.body.timeStart,
      timeArrive: req.body.timeArrive,
      ticketCost: req.body.ticketCost,
    });

    await trip.save();

    res.json({
      success: true
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Check your fields",
    });
  }
});

app.post("/api/search", async (req, res) => {
  try {
    const trips = await Trip.find();
    console.log(req.body)
    const text = req.body.text.toLowerCase();

    const result = trips.filter((obj) => {
      if (
        obj.fromCity.toLowerCase().includes(text) ||
        obj.toCity.toLowerCase().includes(text)
      ) {
        return obj;
      }
    });

    res.json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Check your fields",
    });
  }
});
app.put("/api/trip/:id", async (req, res) => {
  try {
    await Trip.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      {
        fromCity: req.body.fromCity,
        toCity: req.body.toCity,
        timeStart: req.body.timeStart,
        timeArrive: req.body.timeArrive,
        ticketCost: req.body.ticketCost,
      }
    );

    res.json({
      success: true
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Check your fields",
    });
  }
});
app.delete("/api/trip/:id", (req, res) => {
  try {
    Trip.findOneAndDelete(
      {
        _id: req.params.id,
      },
      (err, doc) => {
        if (err) {
          console.log(e);
          res.status(500).json({
            message: "Не получилось видалити поїздку",
          });
        }

        if (!doc) {
          console.log(e);
          res.status(404).json({
            message: "Не получилось получити поїздку",
          });
        }

        res.json({
          success: true,
        });
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Check your fields",
    });
  }
});

app.listen(PORT, async (err) => {
  if (err) {
    throw new Error(err);
  }
  await mongoose
    .connect(
      "mongodb+srv://vladislav:12345@cluster0.arl3wel.mongodb.net/trains?retryWrites=true&w=majority"
    )
    .then(() => {
      console.log("DB ok");
    })
    .catch((e) => console.log("DB error", e));
  console.log("Server is running");
});

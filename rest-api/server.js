const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

const app = express();

// Setting the body parser
app.use(express.json());

// Setting the .env to be usable
dotenv.config({
  path: __dirname + "/config/.env",
});

// Connecting the app to the DB
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false, // To eliminate the deprication when using findOneAndUpdate  and findOneAndDelete
  },
  () => {
    console.log("connected to the DB!!");
  }
);

// Setting the server
app.listen(
  process.env.PORT,
  console.log(`Listening on port ${process.env.PORT}`)
);

// Route Middlewares

// Creating a user
app.post("/api/users", async (req, res) => {
  const user = new User({
    id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Getting all users
app.get("/api/users", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.send(allUsers);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Editing a user by id
app.put("/api/users/:id", async (req, res) => {
  try {
    const editedUser = await User.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: { name: req.body.name },
      },
      { new: true }
    );
    res.send(editedUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Removing a user by id
app.delete("/api/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findOneAndRemove({ id: req.params.id });
    res.send(deletedUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

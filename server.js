const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(express.json());

// PORTS
const PORT = process.env.PORT || 3001;

// SERVER
app.get("/", (req, res) => {
  console.log(`Server started at PORT`);
});

// STATIC FOLDER
app.use(express.static(path.join(__dirname, "staticfolder")));

// ROUTES
// mongodb connect

var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb://feeltrig:feeltrig123@localhost:27017/?authMechanism=DEFAULT&authSource=mongodbdatabase";

const client = new MongoClient(url, {
  useNewURLParser: true,
  useUnifiedTopology: true,
});

// EXPORTING THE DB CONFIG
const connectionvar = client;
module.exports = { connectionvar };

// GET ALL DATA ROUTE
app.use("/api", require("./routes/allData"));

// CREATE USER ROUTE
app.use("/user", require("./routes/createUser"));

// LOGIN ROUTE
app.use("/user", require("./routes/login"));

// USERS PASSWORDS HANDLER ROUTE
app.use("/user", require("./routes/handlePasswords"));

// SYNC PASSWORDS ROUTE
app.use("/user", require("./routes/syncPasswords"));

// SEND ALL PASSWORDS TO CLIENT
app.use("/user/", require("./routes/fetchPasswords"));

// DELETE USER ACCOUNT
app.use("/user", require("./routes/deleteAccount"));

// LISTENING ON PORT
app.listen(PORT);

// SERVER START CONSOLE
console.log(`server started at ${PORT}`);

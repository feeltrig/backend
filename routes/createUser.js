const { connectionvar } = require("../server");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/signin", async (req, res) => {
  const { username, pincode } = req.body;

  // creating hash password
  const userpassword = await bcrypt.hash(req.body.userpassword, 10);

  console.log(userpassword);

  const userprofile = {
    username,
    userpassword,
    pincode,
  };

  console.log(req.body);

  connectionvar.connect(async (err) => {
    if (err) console.log(err);

    const collection = connectionvar
      .db("mongodbdatabase")
      .collection("firstcollection");

    const result = await collection.findOne(userprofile);

    // check if user exists
    if (result !== null) {
      res.json({ message: "User already exists", signin: false });
      connectionvar.close();
    } else {
      const result = await collection.insertOne(req.body);
      res.json({ message: "Sign in succussfull", signin: true });
      connectionvar.close();
    }
  });
});

module.exports = router;

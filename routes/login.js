const { connectionvar } = require("../server");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/login", (req, res) => {
  // check if user exists
  const { username, userpassword, pincode } = req.body;

  const userprofile = {
    username,
    userpassword,
  };

  console.log(req.body);

  //   CONNECTION
  connectionvar.connect(async (err) => {
    if (err) console.log(err);

    const collection = connectionvar
      .db("mongodbdatabase")
      .collection("firstcollection");

    // CHECK IF USER EXISTS AND PASSWORD IS CORRECT

    const result = await collection.findOne(userprofile);
    const dbpassword = await result.userpassword;
    const ispasswordcorrect = await bcrypt.compare(userpassword, dbpassword);

    console.log(ispasswordcorrect);

    // return userprofile if user exists and password is correct
    if (result !== null && ispasswordcorrect) {
      const userData = await collection.findOne(userprofile);
      res.json(userData);

      connectionvar.close();
    } else {
      console.log("wrong username password");
      res.json({ login: false });
    }

    connectionvar.close();
  });
});

module.exports = router;

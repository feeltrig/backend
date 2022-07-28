const { connectionvar } = require("../server");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.get("/fetchpasswords", (req, res) => {
  // COMPLETE PROFILE WITH PASSWORD
  const { username, userpassword } = req.body;

  const userprofile = {
    username,
    userpassword,
  };

  // CONNECTION
  connectionvar.connect(async (err) => {
    if (err) console.log(err);

    const collection = connectionvar
      .db("mongodbdatabase")
      .collection("firstcollection");

    //   main query
    const result = await collection.findOne(userprofile);
    const dbpassword = await result.userpassword;
    const ispasswordcorrect = await bcrypt.compare(userpassword, dbpassword);

    // CHECK IF USER EXISTS
    if (result !== null && ispasswordcorrect) {
      // updating password
      // fetch prev passwords and append the array
      const finalarr = await collection.findOne(userprofile);
      const passwordData = await finalarr.passwordData;

      // sending all data
      res.json({ message: "Passwords secured", payload: passwordData });
      connectionvar.close();
    } else {
      res.json({ message: "User doesn't exists" });
    }

    connectionvar.close();
  });
});

module.exports = router;

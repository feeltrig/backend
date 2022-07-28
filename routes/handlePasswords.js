const { connectionvar } = require("../server");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/Passwords", (req, res) => {
  // COMPLETE PROFILE WITH PASSWORD
  const { username, userpassword, passwordData, pincode } = req.body;

  const userprofile = {
    username,
    userpassword,
    pincode,
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
      const finalarr = await result.passwordData;
      finalarr.push(passwordData);
      console.log(finalarr);

      const result = await collection.updateOne(
        userprofile,
        {
          $set: {
            passwordData: finalarr,
          },
        },
        { upsert: true }
      );
      res.json({ message: "Passwords updated" });
      connectionvar.close();
    } else {
      res.json({ message: "User doesn't exists" });
    }

    connectionvar.close();
  });
});

module.exports = router;

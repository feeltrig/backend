const { connectionvar } = require("../server");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/syncpasswords", (req, res) => {
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
      const userData = await collection.findOne(userprofile);
      const dbpasswords = await userData.passwordData;
      const localPasswords = passwordData;

      // if db has no passwords add
      if (dbpasswords.length < 1 && passwordData.length > 0) {
        const result = await collection.updateOne(
          userprofile,
          {
            $set: {
              passwordData: passwordData,
            },
          },
          { upsert: true }
        );
        console.log("added passwords to empty");
        connectionvar.close();
      }
      if (passwordData.length > 0) {
        //   add new passwords to db is they arent present
        const final = localPasswords.filter((lp) => {
          const insider = dbpasswords.find((dbitem) => {
            return lp.title == dbitem.title;
          });
          return insider == undefined;
        });

        if (final.length > 0) {
          dbpasswords.push(...final);

          const result = await collection.updateOne(
            userprofile,
            {
              $set: {
                passwordData: dbpasswords,
              },
            },
            { upsert: true }
          );

          // sending all synced passwords to client
          res.json({ message: "Passwords synced", payload: dbpasswords });
          connectionvar.close();
        }
      }
    } else {
      res.json({ message: "User doesn't exists" });
      console.log("user not found");
    }

    connectionvar.close();
  });
});

module.exports = router;

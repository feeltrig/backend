const { connectionvar } = require("../server");
const express = require("express");
const router = express.Router();

router.post("/deleteaccount", (req, res) => {
  const { username, userpassword, pincode } = req.body;

  const userprofile = {
    username,
    userpassword,
  };

  connectionvar.connect(async (err) => {
    if (err) console.log(err);

    const collection = connectionvar
      .db("mongodbdatabase")
      .collection("firstcollection");

    // delete user account
    const result = await collection.findOne(userprofile);
    console.log(result);

    if (result !== null) {
      const deleteuse = await collection.deleteOne(userprofile);
      res.json({ message: "Succesfully deleted your account" });
      connectionvar.close();
    } else {
      res.json({ message: "Please try again later" });
    }

    connectionvar.close();
  });
});

module.exports = router;

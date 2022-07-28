const { connectionvar } = require("../server");
const express = require("express");
const router = express.Router();

// GET ALL DATA
router.get("/alldbusers", async (req, res) => {
  connectionvar.connect(async (err) => {
    if (err) console.log(err);

    const collection = connectionvar
      .db("mongodbdatabase")
      .collection("firstcollection");

    //   main query
    const result = await collection.find({}).toArray();
    res.json(result);
    connectionvar.close();
  });
});

module.exports = router;

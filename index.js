const express = require("express");
const app = express();
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const cors = require("cors");
const Drug = require("./Drug");
const uri =
   "mongodb+srv://maheerali121:pakistan@cluster0.rfn0j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/build"));

mongoose
   .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => {
      console.log("connected to the datebase");
   });

app.get("/", (req, res) => {
   res.render(__dirname + "/build/index.html");
});

app.get("/api/rows", (req, res) => {
   const drugs = Drug.find().then((x) => {
      res.json(x);
   });
});

app.post("/api/rows", async (req, res) => {
   console.log(req.body);
   const drugs = req.body.drugs;
   const ids = drugs.map((x) => x.id);
   //Updating and adding new ones.
   drugs.forEach(async (drug) => {
      try {
         const doesDrugExist = await Drug.exists({ id: drug.id });
         console.log(doesDrugExist);
         if (!doesDrugExist) {
            const newDrug = new Drug({ ...drug });
            const saveDrug = await newDrug.save();
            // res.send(newDrug);
         } else {
            await Drug.updateOne({ id: drug.id }, { $set: { ...drug } });
            // res.send("Updated");
         }
      } catch (error) {
         console.log(error);
      }
   });
   //Deleting
   const allDrugs = await Drug.find();
   allDrugs.forEach(async (drug) => {
      if (!ids.includes(drug.id)) {
         await Drug.deleteOne({ id: drug.id });
         console.log("deleted");
      }
   });
   res.send("Saved");
});
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log("listening at port "  + PORT));

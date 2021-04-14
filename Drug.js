const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
   items: [{ type: String, required: true }],
   id: { type: String, required: true, min: 2, max: 40 },
});

const Drug = mongoose.model("Drug", userSchema);
module.exports = Drug;

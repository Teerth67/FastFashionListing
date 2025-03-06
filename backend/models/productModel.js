const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  salePrice:{type:String},
  image: { type: String, required: true },  // <-- Image is now optional
  link: { type: String, required: true },
  source: { type: String, required: true },
  gender:{type:String},
  category: { type: String, required: true },
  scrapedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);

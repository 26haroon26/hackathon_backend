import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  FirstName: { type: String },
  Contact: { type: Number },
  Email: { type: String, required: true },
  Password: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
});
export const userModel = mongoose.model("Users", userSchema);

const AddProductSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  // productImage: String,
  productPrice: Number,
  productDec: String,
  productName: String,
  unitName: String,
  unitPrice: Number,
  createdOn: { type: Date, default: Date.now },
});

export const AddProductModel = mongoose.model("Addproducts", AddProductSchema);

const mongodbURI =
  process.env.mongodbURI ||
  "mongodb+srv://abc:abc@cluster0.qgyid76.mongodb.net/logindata?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);
mongoose.connect(mongodbURI);
mongoose.connection.on("connected", function () {
  console.log("Mongoose is connected");
});

mongoose.connection.on("disconnected", function () {
  console.log("Mongoose is disconnected");
  process.exit(1);
});

mongoose.connection.on("error", function (err) {
  console.log("Mongoose connection error: ", err);
  process.exit(1);
});

process.on("SIGINT", function () {
  console.log("app is terminating");
  mongoose.connection.close(function () {
    console.log("Mongoose default connection closed");
    process.exit(0);
  });
});
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoute = require("./src/routes/auth.routes");
const addressRoute = require("./src/routes/address.routes");
const cartRoute = require("./src/routes/cart.routes");
const orderRoute = require("./src/routes/order.routes");
const productRoute = require("./src/routes/product.routes");
const userRoute = require("./src/routes/user.routes");
const messageRoute = require("./src/routes/message.routes");
const countRoute = require("./src/routes/count.routes");

const app = express();

app.use(cors());
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull"))
  .catch((err) => {
    console.error(err);
  });

app.use(express.json());

app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoute);
app.use("/api/address", addressRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/product", productRoute);
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);
app.use("/api/count", countRoute);

let port = process.env.PORT;

if (port == null || port == "") {
  port = 5000;
}

app.listen(port, () => {
  console.log("Backend server is running! at port " + port);
});

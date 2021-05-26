const path = require("path");
const express = require("express");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const mongoConnect = require("./util/database").mongoConnect;
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs"); // Register template engine
app.set("views", "views"); // Not needed, the default path is already '/views'

// Middleware is triggered by incoming requests
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Store User into a request to use them anywhere in the app
app.use((req, res, next) => {
  User.findById("60ae56cc258f11f738293c6a") // I created that user manually in the db
    .then((user) => {
      // Store the user we retrive from the database into the request
      req.user = user; // user is a sequelize object and it includes methods like destroy()
      next(); // continue with the next step if we got our user and stored it
    })
    .catch((err) => {
      console.log(err);
    });
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});

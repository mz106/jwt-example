
require("dotenv").config();
const passport = require("passport");
const express = require("express");

const { connection } = require("./db");
const User = require("./models/user");
const errorRouter = require("./routes/error");
const userRouter = require("./routes/user");
const { registerStrategy, verifyStrategy, loginStrategy } = require("./auth");

const app = express();

app.use(express.json());

passport.use("register", registerStrategy);
passport.use("login", loginStrategy);
passport.use(verifyStrategy);


app.use("/user", userRouter);
app.use("*", errorRouter); // Use error router here

app.listen(process.env.HTTP_PORT || 5000, async() => {
    connection.authenticate();
    await User.sync({alter: true}); // This creates/updates tables
    console.log("HTTP Server Started");
});

// docker run -dp 3306:3306 -v mysql-config:/etc -v mysql-data:/var/lib/mysql mysql/mysqlserver:latest
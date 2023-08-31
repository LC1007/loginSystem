const express = require("express");
const session = require("express-session");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(
  express.json(),
  session({ secret: "secret_key_test", resave: true, saveUninitialized: true }),
  passport.initialize(),
  passport.session()
);

// Routes
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () =>{
    console.log(`http://localhost:${PORT}`);
})
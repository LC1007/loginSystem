const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../model/User')

passport.use(new LocalStrategy({ usernameField: "emailAdd", passwordField: "userPass" },
    async (emailAdd, userPass, done) => {
        console.log("Received email:", emailAdd);
      try {
        const user = await User.findUserByEmail(emailAdd);
        console.log("Retrieved user:", user);

        if (!user) {
            console.log("User not found");
          return done(null, false, { message: "Incorrect email address" });
        }

        const passwordMatch = await bcrypt.compare(userPass, user.userPass);
        console.log("Password match:", passwordMatch);

        if (!passwordMatch) {
             console.log("Incorrect password");
          return done(null, false, { message: "Incorrect Password" });
        }

        console.log("Authentication successful");
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) =>{
  done(null, user.userID)
})

passport.deserializeUser(async (userID, done) =>{
  try {
    const user = await User.findUserByEmail(userID)
    console.log("User found:", user);
    done(null, user)
  } catch (error) {
    console.error("Error in deserialization:", error);
    done(error)
  }
})

module.exports = passport
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        // check if user exists
        const user = await User.findOne({ username });
        if (!user) {
          return done(null, false, {
            message: "No user found with that username",
          });
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          // passwords match - return user
          return done(null, user);
        } else {
          // passwords do not match - return error message
          return done(null, false, { message: "Password is incorrect" });
        }
      } catch (e) {
        return done(e);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

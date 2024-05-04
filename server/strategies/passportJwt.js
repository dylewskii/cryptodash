const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");
require("dotenv").config();

const cookieExtractor = function (req) {
  return req && req.cookies ? req.cookies["token"] : null;
};

const options = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    cookieExtractor, // attempt to get token from cookie
    ExtractJwt.fromAuthHeaderAsBearerToken(), // if no cookie, check the Authorization header
  ]),
  secretOrKey: process.env.JWT_KEY,
};

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);

      if (user) {
        return done(null, user);
      } else {
        return done(null, false, { message: "User not found" });
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;

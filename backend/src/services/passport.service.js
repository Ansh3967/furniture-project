import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import Admin from "../models/admin.model.js";
import User from "../models/user.model.js"; // Make sure this exists

// JWT options
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "secret",
};

// Admin JWT Strategy
passport.use(
  "admin",
  new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
      const admin = await Admin.findById(jwt_payload.id);
      if (admin) {
        return done(null, admin);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// User JWT Strategy
passport.use(
  "user",
  new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// Optionally, serialize/deserialize (if using sessions)
passport.serializeUser((entity, done) => {
  done(null, {
    id: entity.id,
    type: entity instanceof Admin ? "admin" : "user",
  });
});

passport.deserializeUser(async (obj, done) => {
  try {
    if (obj.type === "admin") {
      const admin = await Admin.findById(obj.id);
      done(null, admin);
    } else {
      const user = await User.findById(obj.id);
      done(null, user);
    }
  } catch (err) {
    done(err);
  }
});

export default passport;

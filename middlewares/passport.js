const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/daos/Users.dao");
const { formatUserForDB } = require("../utils/users.utils");

const salt = () => bcrypt.genSaltSync(10);
const createHash = (password) => bcrypt.hashSync(password, salt());
const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);
// Passport  Local Strategy
//Singup
passport.use(
  "signup",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const userItem = {
          firtname: req.body.firtname,
          lastname: req.body.lastname,
          birthdate: req.body.birthdate,
          email: username,
          password: createHash(password),
        };
        const newUser = formatUserForDB(userItem);
        const user = await User.createUser(newUser);
        console.log("Registration success");
        return done(null, user);
      } catch (error) {
        console.log("Error singing user");
        return done(error);
      }
    }
  )
);

// Singin

passport.use(
  "signin",
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.getByEmail(username);
      if (!isValidPassword(user, password)) {
        console.log("Invalid User or Password");
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      console.log("Error signing in...");
      return done(error);
    }
  })
);
//serialization
passport.serializeUser((user, done) => {
  done(null, user._id);
});

//deserialization

passport.deserializeUser(async (id, done) => {
  const user = await User.getById(id);
  done(null, user);
});

module.exports = passport;

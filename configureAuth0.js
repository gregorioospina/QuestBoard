const passport = require("passport");
const Auth0Strategy = require('passport-auth0');
const session = require("express-session");

const dotenv = require("dotenv");
dotenv.config();

const configureAuth0 = app => {
  // Configure the Slack Strategy
  passport.use(
    new Auth0Strategy({
	   		domain:       process.env.AUTH0_DOMAIN,
	   		clientID:     process.env.AUTH0_CLIENT_ID,
	   		clientSecret: process.env.AUTH0_CLIENT_SECRET,
	   		callbackURL:  'http://localhost:3001/auth/callback'
  	  },
      (accessToken, refreshToken, extraParams, profile, done) => {
        console.log("Successful Auth", accessToken, profile);
        return done(null, profile);
      }
    )
  );

  // When using Passport's session functionality, you need to tell passport how to
  // serialize/deserialize the user object to the session store
  passport.serializeUser((user, done) => {
    // Simplest possible serialization
    done(null, JSON.stringify(user));
  });

  passport.deserializeUser((json, done) => {
    // Simplest possible deserialization
    done(null, JSON.parse(json));
  });

  app.use(
    session({
      cookie: {
        // secure should be enabled in a production app, but disabled for simplicity
        // secure: true,
      },
      resave: false,
      saveUninitialized: false,
      secret: "Maria loves this!"
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
};

module.exports = configureAuth0;
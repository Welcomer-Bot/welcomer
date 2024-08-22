import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/discord", passport.authenticate("discord"));

// router.get("/discord/callback", passport.authenticate("discord", { failureRedirect: process.env.CLIENT_FAILURE_REDIRECT, failureMessage: true, successRedirect: process.env.CLIENT_SUCESS_REDIRECT }));

router.get('/discord/callback', function (req, res, next) {
  passport.authenticate('discord', function (err: { message: any; }, user: any) {
    if (err) {
      return res.status(500).send({ message: err.message });
    }
    if (!user) {
      return res.status(401).send({ message: 'User not found' });
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(200).send({ message: 'Logged In', user: req.user });
    });


  })(req, res, next);
});


router.get("/status", (req, res) => {
  if (req.user) {
    res.status(200).send({user: req.user });
  }
  else {
    res.sendStatus(401)
  }
});

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.sendStatus(200);
  });
});

export default router;
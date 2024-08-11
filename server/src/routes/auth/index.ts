import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/discord", passport.authenticate("discord"), (req, res) => { 
    res.sendStatus(200);
});

router.get('/discord/redirect', passport.authenticate('discord'), (req, res) => {
    if (req.user) {
        res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    }
    else {
        res.redirect(`${process.env.FRONTEND_URL}/login/error`);
    }
});

router.get("/status", (req, res) => {
    if (req.user) {
        res.send({ status: 200, message: 'Logged In', user: req.user});
    }
    else {
        res.send({ status: 401, message: 'Unauthorized' });
    }
});

router.get("/logout", (req, res, next) => {
      req.logout(function(err) {
    if (err) { return next(err); }
    res.sendStatus(200);
  });
});

export default router;
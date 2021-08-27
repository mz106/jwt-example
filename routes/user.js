
const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const session = {session: false};

const router = express.Router();

const profile = async (req, res, next) => {
    res.status(200).json({msg: "Profile", user: req.user, token: req.query.secret_token});
};

const register = async (req, res, next) => {
    req.user.name ? res.status(200).json({msg: "registered successfully", user: req.user}) : res.status(401).json({msg: "user already exists"});
};

const login = async (req, res, next) => {

    passport.authenticate('login', async (err, user, info) => {
        
        try {
            if (err) {
                res.status(500).json({msg: "Internal Server Error."});
            } else if (!user) {
                res.status(401).json({msg: "User not found"});
            } else {
                const fn = async(error) => error ? next(error) : res.status(200).json({user, token: jwt.sign({user: {id: user.id, name: user.name}}, process.env.SECRET_KEY)});
                req.login(user, session, fn);
            }
 
        } catch (error) {
            return next(error);
        }

    })(req, res, next);
};

router.post("/register", passport.authenticate("register", session), register);
router.get("/profile", passport.authenticate("jwt", session), profile);
router.post("/login", login);

module.exports = router;

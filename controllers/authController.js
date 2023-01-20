const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.signUpGet = (req, res) => {
    res.render("sign-up", { title: "Sign Up" })
}

exports.signUpPost = [
    body("firstName", "First name is required")
        .trim()
        .isLength({ min: 1 }),
    body("lastName", "Last name is required")
        .trim()
        .isLength({ min: 1 }),
    body("userName", "User name is required")
        .trim()
        .isLength({ min: 1 }),
    body("password")
        .trim()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
    // .custom((value, { req }) => /\d/.test(value))
    // .withMessage("Password must contain number")
    // .custom((value, { req }) => /[A-Z]/.test(value))
    // .withMessage("Password must contain upper case letter")
    // .custom((value, { req }) => /[a-z]/.test(value))
    // .withMessage("Password must contain lower case letter")
    // .custom((value, { req }) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value))
    // .withMessage("Password must contain special characters")
    ,
    body("confirmPassword")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please confirm your password")
        .custom((value, { req }) => value === req.body.password)
        .withMessage("Passwords don't match"),
    (req, res, next) => {

        const errors = validationResult(req);

        const invalidUser = new User(
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                userName: req.body.userName,
                password: req.body.password,
                isMember: false,
            });

        if (!errors.isEmpty()) {
            res.render("sign-up", {
                title: "Sign up",
                user: invalidUser,
                errors: errors.array(),
            });
            return;
        }
        else {
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                if (err) {
                    return next(err);
                }
                const newUser = new User(
                    {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        userName: req.body.userName,
                        password: hashedPassword,
                        isMember: false,
                    });
                newUser.save((err) => {
                    if (err) {
                        return next(err);
                    }

                    res.redirect("/");
                });
            });
        }
    }
]

exports.logInGet = (req, res) => {
    res.render("log-in", { title: "Log In" });
}

exports.logInPost = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
})

exports.logOutGet = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
}
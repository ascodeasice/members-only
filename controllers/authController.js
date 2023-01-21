const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const Message = require("../models/message");

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

                    res.redirect("/log-in");
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

exports.joinMemberGet = (req, res, next) => {
    res.render("member-form", {
        title: "Become a member",
        user: res.locals.currentUser,
    });
}

exports.joinMemberPost = [
    body("memberPassword")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Thou shalt not pass with an empty box")
        .custom((value, { req }) => value === "password") // Yes, the secret password is "password"
        .withMessage("Wrong member password, enter password to be a member"),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render("member-form", {
                title: "Become a member",
                errors: errors.array(),
                user: res.locals.currentUser,
            });
            return;

        } else {
            User.findByIdAndUpdate(res.locals.currentUser._id, { isMember: true }, (err, user) => {
                if (err) {
                    return next(err);
                }
                res.redirect("/");
            });
        }
    }
]

exports.beAdminGet = (req, res) => {
    res.render("admin-form", {
        title: "Become an admin",
        user: res.locals.currentUser,
    });
}

exports.beAdminPost = [
    body("adminPassword")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Admin password is required")
        .custom((value, { req }) => value === "secret")
        .withMessage("Wrong admin password, the password is secret"),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render("admin-form", {
                title: "Become an admin",
                user: res.locals.currentUser,
                errors: errors.array(),
            });
            return;
        }
        else {
            // not logged in
            if (!res.locals.currentUser) {
                res.render("admin-form", {
                    title: "Become an admin",
                    user: res.locals.currentUser,
                });
                return;
            }
            User.findByIdAndUpdate(res.locals.currentUser, { isAdmin: true }, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect("/");
            });
        }
    }

]

exports.deleteMessageGet = (req, res, next) => {
    Message.findById(req.params.id)
        .populate("author")
        .exec((err, message) => {
            if (err) {
                return next(err);
            }
            if (message == null) {
                const error = new Error("Message not found");
                error.status = 404;
                next(error);
            }

            res.render("delete-message", {
                title: "Delete Message",
                message: message,
                user: res.locals.currentUser,
            });
        });
}

exports.deleteMessagePost = (req, res, next) => {
    Message.findById(req.body.messageId).exec(
        (err, book) => {
            if (err) {
                return next(err);
            }
            Message.findByIdAndRemove(req.body.messageId, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect("/");
            });
        });
}
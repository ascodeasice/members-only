const { body, validationResult } = require("express-validator");
const Message = require("../models/message");

exports.createGet = (req, res) => {
    res.render("message-form", {
        title: "Create message",
        user: res.locals.currentUser,
    });
}

exports.createPost = [
    body("title", "Title is required")
        .trim()
        .isLength({ min: 1 }),
    body("text", "Text is required")
        .trim()
        .isLength({ min: 1 }),
    (req, res, next) => {
        const errors = validationResult(req);

        console.log(res.locals.currentUser);
        const newMessage = new Message({
            title: req.body.title,
            text: req.body.text,
            author: res.locals.currentUser,
        });

        if (!errors.isEmpty()) {
            res.render("message-form", {
                title: "Create message",
                message: newMessage,
                errors: errors.array(),
                user: res.locals.currentUser,
            });
            return;
        }
        newMessage.save((err) => {
            if (err) {
                return next(err);
            }
            res.redirect("/");
        });
    }
]
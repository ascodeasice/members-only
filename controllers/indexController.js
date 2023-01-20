const Message = require("../models/message");

exports.indexGet = (req, res, next) => {
    Message.find({})
        .populate("author")
        .exec((err, messages) => {
            res.render('index', {
                title: 'Message Board',
                user: res.locals.currentUser,
                messages: messages,
            });
        });
}
exports.indexGet = (req, res, next) => {
    res.render('index', {
        title: 'Message Board',
        user: res.locals.currentUser,
    });
}
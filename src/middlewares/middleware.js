exports.middlewareGlobal = (req, res, next) => {
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user; // Recebo em uma variavel global a requisição de um usuario que foi passado em outro local
    next();
};

exports.outroMiddleware = (req, res, next) =>{
        next();
    };

    exports.checkCsrfErrors = (err, req, res, next) =>{
    if(err){
        console.log(err);
        return res.render('404');
    }
    next();
}

    exports.csrfMiddleware = (req, res, next) => {
        res.locals.csrfToken = req.csrfToken();
        next();
    };

    exports.loginRequired = (req, res, next) => {
        if(!req.session.user){
            req.flash('errors', 'Voce Precisa Fazer Login');
            req.session.save(() => res.redirect('/'));
            return;
        }
        next();
    }
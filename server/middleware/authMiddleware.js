module.exports = {
    usersOnly: (req, res, next) => {
        if (!req.session.user) {
            return res.status(401).send('please log in')
        }

        next()
    },

    adminsOnly: (req, res, next) => {
        if (!req.session.user.isAdmin) {
            res.status(403).send('FORBIDDEN')
        }

        next()
    },
}

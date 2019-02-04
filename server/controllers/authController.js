const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const db = req.app.get('db')

        try {
            const { username, password, isAdmin } = req.body
            const result = await db.get_user(username)
            const existingUser = result[0]

            if (existingUser) {
                res.status(409).json({ err: 'Username taken' })
            }

            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)

            const registeredUser = await db.register_user([
                isAdmin,
                username,
                hash,
            ])
            const user = registeredUser[0]
            req.session.user = {
                isAdmin: user.is_admin,
                id: user.id,
                username: user.username,
            }

            res.status(201).json(req.session.user)
        } catch (e) {
            console.log(e)
        }
    },

    login: async (req, res) => {
        const db = req.app.get('db')
        const { username, password } = req.body

        try {
            const foundUser = await db.get_user(username)
            const user = foundUser[0]

            if (!user) {
                res.status(401).json({ err: 'No user found' })
            }

            const isAuthentictaed = bcrypt.compareSync(password, user.hash)
            if (!isAuthentictaed) {
                res.status(403).json({ err: 'Incorrect password!' })
            }

            req.session.user = {
                isAdmin: user.is_admin,
                username: user.username,
                id: user.id,
            }

            res.status(200).json(req.session.user)
        } catch (e) {
            console.log(e)
        }
    },

    logout: (req, res) => {
        req.session.destroy()
        res.status(200).json('Successfully logged out')
    },
}

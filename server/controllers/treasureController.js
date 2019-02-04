module.exports = {
    dragonTreasure: async (req, res) => {
        const db = req.app.get('db')

        try {
            const result = await db.get_dragon_treasure(1)
            res.status(200).json(result)
        } catch (e) {
            console.log(e)
        }
    },

    getUserTreasure: async (req, res) => {
        const db = req.app.get('db')

        try {
            const result = await db.get_user_treasure([req.session.user.id])
            res.status(200).send(result)
        } catch (e) {
            console.log(e)
        }
    },

    addUserTreasure: async (req, res) => {
        const db = req.app.get('db')
        const { treasureURL } = req.body
        const { id } = req.session.user
        console.log(id)
        console.log(id)
        try {
            const userTreasure = await db.add_user_treasure([treasureURL, id])
            console.log('please')
            res.status(200).json(userTreasure)
        } catch (e) {
            console.log(e)
        }
    },

    getAllTreasure: async (req, res) => {
        const db = req.app.get('db')

        try {
            const results = await db.get_all_treasure()
            res.status(200).send(results)
        } catch (e) {
            console.log(e)
        }
    },
}

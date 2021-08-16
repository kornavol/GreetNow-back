const mongoEvents = require("../model/events");
const mongoCategories = require("../model/categories");

exports.events = async (req, res) => {
    const eventsDB = await mongoEvents.find().exec()

    const eventsList = eventsDB.map((event) => {
        const name = event.name
        return name
    })

    res.send({
        status:'success',
        data:eventsList
    })
}

exports.categories = async (req, res) => {
    const categoriesDB = await mongoCategories.find().exec()

    const categoriesList = categoriesDB.map((category) => {
        const name = category.name
        return name
    })

    res.send({
        status:'success',
        data:categoriesList
    })
}
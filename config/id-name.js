const mongoEvents = require("../model/events");
const mongoCategories = require("../model/categories");

exports.convertIds = async (db, name) => {

    let sorce;

    switch (db) {
        case 'events':
            sorce = mongoEvents
            break;
        case 'categories':
            sorce = mongoCategories
            break;

        default:
            sorce = null
            break;
    }
    
    /* !To-do: Protected code for wrong db  */
    const tempRes = await sorce.find().exec()

    let conformity = {}

    tempRes.forEach(event => {
        conformity[event._id] = event.name
    });

    return conformity
}


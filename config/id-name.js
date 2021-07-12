const mongoose = require('mongoose')
const mongoEvents = require("../model/events");
const mongoCategories = require("../model/categories");
const chalk = require('chalk')

exports.convertIds = async () => {

    // let sorce;

    // switch (db) {
    //     case events:
    //         sorce = mongoEvents
    //         break;
    //     case categories:
    //         sorce = mongoCategories
    //         break;

    //     default:
    //         break;
    // }

    let events = []
    const newEvents = await mongoEvents.find().exec()

    newEvents.forEach(event => {
        const conformity = {}
        conformity[event._id] = event.name

        events.push(conformity)
    });

    console.log('test', events);

}


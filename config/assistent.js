const dates = require("../model/dates");

const Users = require("../model/User");
const Events = require("../model/events");

const createRandomeCard = require("./func/rendomCard");

exports.cardAssistant = async (validPer) => {
    /* CREATING CURRENT DATE AND TIME POINT*/

    /* Create current date (day) */
    // const ts = Date.now();
    const date = new Date();
    date.setHours(0);
    
    // console.log('date', date);

    const dataConvertor = (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        /* saving date in YYYY-MM-DD format */
        return year + "-" + month + "-" + day;
    };

    const dataConvertor2 = (date) => {
        const day = date.getDate();
        const month = date.getMonth() * 30;

        /* saving date in YYYY-MM-DD format */
        return month + day;
    };

    // const currDate = dataConvertor(date);
    const currDate = date
    console.log("current date:", date);

    const createTimePoint = (period) => {
        /* Validation period. How many days to check the event. 
        Conver days to ms days */

        /* The data is object which loolks like can't be clone. 
        It's a reason why I define a new date below */
        const newDate = new Date();
        /* increasing the date by a certain period */
        newDate.setDate(newDate.getDate() + period);

        // const timePoint = dataConvertor(newDate);

        // console.log('date', date);
        // console.log('newDate', newDate);

        // const test = newDate > date
        // console.log('test', test);

        // return timePoint;
        return newDate;
    };

    let timePoint = createTimePoint(validPer);
    console.log("timePoint:", timePoint);

    /* CHECKING IF WE USE ASSISTENT FUNCTION TODAY */

    async function repeatChecker() {
        const record = await dates.findOne({ date: currDate });

        // console.log('record', record);

        let needContinue = false;

        /* Checking if we have doc. with this record. 
        If we don't have create new record  */
        if (!record) {
            const doc = new dates({
                date: currDate,
                checked: false,
            });

            await doc.save((err, doc) => {
                if (err) {
                    console.log("err:", err);
                } else {
                    console.log("doc:", doc);
                }
            });

            needContinue = true;
            /* cheking if main function was complited 
            and change a status regarding to result */
        } else if (record.checked === false) {
            needContinue = true;
        } else if (record.checked === true) {
            needContinue = false;
        }

        return needContinue;
    }

    const permision = await repeatChecker();

    console.log("Do we need to create cards automatically today?:", permision);

    /* cheking if main function was complited. 
    If yes on this point function will be stop */
    if (!permision) {
        /* Fo-DO. Need to return some message */
        return;
    }

    /* COMPARISON OF DATE OF RECIPIENTS EVENTS OF USER */
    /* Counter for how much cards was created */
    let createdCard = 0;

    /* Creating a events table */
    async function CreateEventsList() {
        const events = await Events.find({}).exec();
        // console.log('evetns', evetns);

        const list = {};

        events.forEach((event) => {
            /* !!Bug */
            // console.log(11, event.public);
            // if (event.public) {
            if (event.name !== "Birthday" && event.name !== "Wedding") {
                /* difference of writting */
                const name = event.name.toLowerCase();

                const day = event.day;
                const month = event.month;

                const data = `2021-${month}-${day}`;

                list[name] = data;
            }
        });

        return list;
    }

    const eventsList = await CreateEventsList();
    // console.log("eventsList", eventsList);

    /* Creation a collection if all recipients */
    const allUsers = await Users.find({});
    // console.log('allUsers', allUsers);

    allUsers.forEach((user) => {
        /* users id HERE */
        // console.log('recip', recip.id)

        // console.log('recip', recip.recipients)
        const currUserRecip = user.recipients;
        /* Data cheking */
        if (currUserRecip.length > 0) {
            // console.log('name', events.events);

            currUserRecip.forEach((recipient) => {
                const events = recipient.events;
                const relationships = recipient.relationships;
                const resID = recipient._id;
                // console.log("relationships: ", relationships);

                /* Cheking public events */
                const valEvents = events.filter((event) => {
                    /* data validation of public event: */
                    // console.log('event time',eventsList[event])

                    if (timePoint >= eventsList[event]) {
                        return event;
                    }

                    /* of birthday. TO:DO: change logic to all private events */
                    if (event == "birthday") {
                        const a = dataConvertor2(recipient.dateOfBirth)
                        const b = dataConvertor2(timePoint)

                        // console.log('a and b: ', a, b);

                        if (b >= a) {

                            console.log(recipient.dateOfBirth);
                            return event;

                        }
                    }
                });

                /* CREATE CARD AND SAVE ALL CHANGES TO DB.
                MARK DAY AS FINISHED*/
                if (valEvents.length > 0) {
                    valEvents.forEach(async (event) => {
                        // console.log('event', event);

                        if (!recipient.autoCards) {
                            recipient.autoCards = {};
                        }

                        if (recipient.autoCards[event] === undefined) {
                            recipient.autoCards[event] = false;
                        }

                        if (recipient.autoCards[event] === false) {
                            recipient.autoCards[event] = false;
                            const card = await createRandomeCard(event, relationships, resID);
                            createdCard++;

                            /* add a numbers of card mark to current reciient  */
                            // console.log('recipient', recipient);
                            if (!recipient.newCards) {
                                recipient.newCards = 1;
                            } else {
                                if (typeof recipient.newCards == "number") {
                                    recipient.newCards++;
                                } else {
                                    recipient.newCards = 1;
                                }
                            }

                            /* save card to current user */
                            if (card) {
                                user.cards.unshift(card);
                            }

                            /* We need define user again befor saving again and save this user. It's neccessery!!! 
                                          P.S. Looks like not  */
                            // const currUser = await Users.findById(user._id);
                            await user.save((err, doc) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(`Card was created and saved.
                                For user: ${doc._id};
                                Event: ${event}`);
                                }
                            });
                        }
                    });
                    // console.log('autoCards: ', recipient.autoCards);
                }
            });
        }
    });

    /* UPDATE DATA CHECKER */
    // await dates.findOneAndUpdate(
    //     { date: currDate },
    //     { createdCard, checked: true }
    // );

    console.log("createdCard", createdCard);
};

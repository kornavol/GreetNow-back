const dates = require("../model/dates");
const Users = require("../model/User");
const Events = require("../model/events");

const createRandomeCard = require("./func/rendomCard");

/* Validation period. How many days to check the event.*/
exports.cardAssistant = async (validPer) => {
    /* 1. CREATING CURRENT DATE AND TIME POINT*/

    /* Create current date (day) */
    const date = new Date();
    /* Probably. we need to put '2' as difference between timezones */
    date.setHours(2, 0, 0, 0);

    // console.log('date', date);

    const currDate = date
    console.log("current date:", date);


    function createTimePoint(period) {
        /* The data is a special object which loolks like can't be cloned. 
        It's a reason why I define a new date below */
        const newDate = new Date();
        /* increasing the date by a certain period */
        newDate.setDate(newDate.getDate() + period);

        return newDate;
    };

    let timePoint = createTimePoint(validPer);
    console.log("timePoint:", timePoint);

    /* 2. CHECKING IF WE USE ASSISTENT FUNCTION TODAY */

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
    If yes on this point function will be stoped */
    if (!permision) {
        /* o-DO. Need to return some message */
        return;
    }

    /* 3. COMPARISON OF DATE OF RECIPIENTS EVENTS OF USER */

    /* Creating a events table */
    async function createEventsList() {
        const events = await Events.find({}).exec();
        // console.log('evetns', evetns);

        const list = {};

        events.forEach((event) => {
            /* !!Bug */
            // console.log(11, event.date);
            // if (event.public) {
            if (event.name !== "Birthday" && event.name !== "Wedding") {
                /* difference of writting */
                const name = event.name.toLowerCase();
                list[name] = event.date;
            }
        });

        return list;
    }

    const eventsList = await createEventsList();
    // console.log("eventsList", eventsList);

    /* Creation a collection if all recipients */
    const allUsers = await Users.find({});
    // console.log('allUsers', allUsers);

    allUsers.forEach(async (user) => {
        // console.log('recip', recip.id)

        // console.log('recip', recip.recipients)
        const currUserRecip = user.recipients;
        /* Data cheking */
        if (currUserRecip.length > 0) {
            // console.log('name', events.events);

            currUserRecip.forEach(async (recipient, index) => {
                const events = recipient.events;
                const relationships = recipient.relationships;
                const resID = recipient._id;
                // console.log("relationships: ", relationships);

                /* Cheking public events */
                const valEvents = events.filter((event) => {
                    // console.log('event time',eventsList[event])

                    if (timePoint >= eventsList[event]) {
                        const diff = Math.floor((timePoint - recipient.dateOfBirth) / 86400000)

                        /* To prevent notification about to far events */
                        if (diff <= validPer) {
                            return event;
                        }
                    }

                    /* for birthday. TO:DO: change logic to all private events */
                    if (event == "birthday") {
                        /* assign birthday data a current year, for comparison with timepoint */
                        const dateOfBirth = recipient.dateOfBirth
                        dateOfBirth.setFullYear(2021)

                        // console.log('dateOfBirth:', dateOfBirth)

                        if (timePoint >= dateOfBirth) {
                            const diff = Math.floor((timePoint - recipient.dateOfBirth) / 86400000)

                            /* To prevent notification about to far events */
                            if (diff <= validPer) {
                                return event;
                            }

                            // console.log('>=',recipient.dateOfBirth, timePoint);
                            // console.log('=',diff);
                        }
                    }
                });

                /* CREATE CARD AND SAVE ALL CHANGES TO DB.
                MARK DAY AS FINISHED*/
                if (valEvents.length > 0) {
                    await valEvents.forEach(async (event, i) => {
                        // console.log('event', event);
                        

                        /* Controler to prevent creating card for validated event again*/
                        if (!recipient.autoCards) {
                            recipient.autoCards = {};
                        }

                        if (recipient.autoCards[event] === undefined) {
                            recipient.autoCards[event] = false;
                        }

                        if (recipient.autoCards[event] === false) {
                            /* Controler to prevent creating card for validated event again*/
                            
                            const card = await createRandomeCard(event, relationships, resID);
                            
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
                                // console.log('before', recipient.autoCards );
                                recipient.autoCards[event] = true;
                                
                                // console.log('after', recipient.autoCards );
                                user.cards.unshift(card);
                                // console.log(`Created card: 
                                //     event:${event}
                                //     user: ${user._id}
                                //     recipient: ${recipient.firstName} `);
                            }

                            /* We need define user again befor saving again and save this user. It's neccessery!!! 
                            P.S. Looks like not  */
                            // const currUser = await Users.findById(user._id);

                        }

                        /* Checking the cycle for the last rount of receipient en event
                        TO-Do: update all forEach to for of 
                        */
                        if (index == currUserRecip.length - 1 && i == valEvents.length - 1) {
                             console.log('autoCards:', recipient.autoCards);
                            await user.save((err, doc) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(111, doc);
                                }
                            });
                        }
                    });
                }
                
            });
        }
        /*this save to update sync. results  f.e. autoCards */
        // await user.save((err, doc) => {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         // console.log(111, doc);
        //     }
        // });

    });

    /* UPDATE DATA CHECKER */
    // await dates.findOneAndUpdate(
    //     { date: currDate },
    //     { createdCard, checked: true }
    // );

};

const dates = require("../model/dates");

exports.cardAssistant = async (validPer) => {

    /* CREATING CURRENT DATE AND TIME POINT*/

    /* Create current date (day) */
    const ts = Date.now();
    const date = new Date(ts);

    // console.log('date', date);

    const dataConvertor = (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        /* saving date in YYYY-MM-DD format */
        return year + "-" + month + "-" + day;
    };

    const currDate = dataConvertor(date);
    console.log("current date:", currDate);

    const createTimePoint = (period) => {
        /* Validation period. How many days to check the event. 
        Conver days to ms days */

        /* The data is object which loolks like can't be clone. 
        It's a reason why I define a new date below */
        const newDate = new Date(ts);
        /* increasing the date by a certain period */
        newDate.setDate(newDate.getDate() + period);

        const timePoint = dataConvertor(newDate);

        // console.log('newDate', newDate);

        return timePoint;
    };

    const timePoint = createTimePoint(validPer);
    console.log("timePoint:", timePoint);

    /* CHECKING IF WE USE ASSISTENT FUNCTION TODAY */

    const repeatChecker = async () => {
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
    };

    const permision = await repeatChecker();

    console.log("can continue:", permision);

    /* cheking if main function was complited. 
      If yes on this point function will be stop */
    if (!permision) {
        /* Fo-DO. Need to return some message */
        return;
    }

    /* COMPARISON OF DATE OF RECIPIENTS EVENTS OF USER */


/* the end bracket */
};

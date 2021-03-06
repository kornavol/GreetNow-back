exports.convertIds = (req, res, next) => {
    /* Cheking if we have requst with filters */
    let isFiltred = false;
    let event = req.query.event;
    let category = req.query.category;


    if (event) {
        isFiltred = true;
        event = event.toLowerCase();
    } else if (category) {
        isFiltred = true;
        category.toLowerCase();
    }

    function findId(collection) {
        let lookUpTab = null;
        let input = null;

        if (collection === "category") {
            lookUpTab = req.app.locals.categoriesLookupTab;
            input = category;
        }

        if (collection === "event") {
            lookUpTab = req.app.locals.eventsLookupTab;
            input = event;
        }

        for (const id in lookUpTab) {
            const name = lookUpTab[id];

            if (name == input) {
                let result = id;
                req.query[collection] = result;
                break
            }
        }
    }

    if (event) {
        findId("event");
    }

    if (category) {
        findId("category");
    }

    req.query.isFiltred = isFiltred;
    next();
};

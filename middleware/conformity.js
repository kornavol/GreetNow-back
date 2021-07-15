exports.convertIds = (req, res, next) => {

    /* Cheking if we have requst with filters */
    let isFiltred = false
    const eventId = req.query.event;
    const categoryId = req.query.category

    console.log(isFiltred)


    if (eventId || categoryId) {
        isFiltred = true
    }

    if (eventId) {
        const lookUpTab = req.app.locals.eventsLookupTab;
        // console.log(event)

        let result

        for (const id in lookUpTab) {

            const name = lookUpTab[id];

            if (name == eventId) {
                result = id
            }
            // console.log('id:',id);
            // console.log('name:',name);
        }

        // console.log(result);
        req.query.event = result        
    }
    
    if (categoryId) {
        const lookUpTab = req.app.locals.categoriesLookupTab;
        // console.log(event)

        let result

        for (const id in lookUpTab) {

            const name = lookUpTab[id];

            if (name == categoryId) {
                result = id
            }
            // console.log('id:',id);
            // console.log('name:',name);
        }

        // console.log(result);
        req.query.category = result        
    }
        
    req.query.isFiltred = isFiltred
    next();

    // return (req, res, next) => {
    //     console.log('middleware')
    //     res = res
    //     next();
    // }
}

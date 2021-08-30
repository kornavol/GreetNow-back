const idToDb = require("../../config/id-name");

const Texts = require('../../model/texts')
const Pictures = require('../../model/pictures')

/* TO:DO - Need to create logic fitring by category  */

async function createRandomeCard(event, categ, recipient) {
    // console.log('createRandomeCard:', event, relationships);

    function inverse(obj) {
        let retobj = {};
        for (let key in obj) {
            retobj[obj[key]] = key;
        }
        return retobj;
    }

    /* invert confirm tables */
    const eventsLookupTab = inverse(await idToDb.convertIds("events"))
    const categoriesLookupTab = inverse(await idToDb.convertIds("categories"))

    // console.log(eventsLookupTab);

    const eventId = eventsLookupTab[event]
    const categoriesId = categoriesLookupTab[categ]
    const card = {
        text: "",
        picture: "",
        recipient,
        event,
        categ,
        createdBy:'app'
    }

    // console.log(eventId);

    if (eventId) {
        /* take random picture */
        const pictList = await Pictures.find({events: { _id: eventId }})
        const picture = pictList[Math.floor(Math.random() * pictList.length)];
        // console.log('picture:', picture);

        /* take random text */
        const textList = await Texts.find({events: { _id: eventId }})
        const text = textList[Math.floor(Math.random() * textList.length)];
        // console.log('text:', text);

        card.picture = picture.name
        card.text = text.text
    }

    // console.log('CARD:', card);

    return card




}


module.exports = createRandomeCard;
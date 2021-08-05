const conformaty = require('../app')

const events = conformaty.eventsConformity

exports.test = () => {
  setTimeout(() => console.log('eventsConformity', events), 2000)
}
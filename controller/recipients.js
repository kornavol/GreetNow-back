const User = require('../model/User');

exports.newRecord = async (req, res) => {
    const recipient = req.body;
    console.log(recipient);


    const user = await User.findById('61111dbbcaed1572881e545a')
    console.log(user)
 
    user.recipients.unshift(recipient)
    
    const currRecipient = user.recipients[0];

    await user.save((err, doc) => {
        if (err) {
            console.log(err);
            res.send({ status: 'failed', message: err });
        } else {
            res.send(({ status: 'success', message: 'Contact updated successfully', data: currRecipient }));
        }

    })

}
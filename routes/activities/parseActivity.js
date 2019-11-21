const parseActivity = require('../../logic/activityParser');

module.exports = async (req, res) => {
    let msg = req.body.message;
    let result = await parseActivity(msg); 
    res.status(200).send(result);
};
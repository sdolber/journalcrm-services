const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore();

module.exports = async (req, res) => {
    let msg = req.body.message;

    const document = firestore.doc(`${req.user.email}/crm/accounts/test-account`);
 
    // Enter new data into the document.
    await document.set({
      title: 'Welcome to Firestore',
      body: 'Hello World',
    });

    console.log('Entered new data into the document');

    res.status(200).send({});
};
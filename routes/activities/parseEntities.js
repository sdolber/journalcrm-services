const language = require('@google-cloud/language');

module.exports = async (req, res) => {
    let msg = req.body.message;
    
    const lsClient = new language.LanguageServiceClient();
  
    const document = {
      content: msg,
      type: 'PLAIN_TEXT',
    };
  
    // Detects entities in the document
    const [tokens] = await lsClient.analyzeEntitySentiment({document});
  
    res.status(200).send(tokens);
  };
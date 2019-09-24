const chrono = require('chrono-node');
const language = require('@google-cloud/language');

const parseActivityType = (entity, originalValue) => {
    let lentityname = entity.name.toLowerCase();
    
    if (entity.salience > 0.3) {
        if ((entity.type === "WORK_OF_ART" || entity.type === "OTHER") && lentityname === "email") {
            return "EMAIL";
        }
    
        if (entity.type === "EVENT") {
            return "MEETING";
        }
    
        if (entity.type === "OTHER" && (lentityname === "phone call" || lentityname === "call")) {
            return "PHONE";
        }
    }

    return originalValue;
}

const parseActivityTypeFromSyntax = (activity, tokens) => {
    tokens.forEach(part => {
        if (part.partOfSpeech.tag === "VERB" && part.partOfSpeech.tense === "PAST") {
            let llemma = part.lemma.toLowerCase();
            
            if (llemma === "call" || llemma === "talk" || llemma === "dial" || llemma === "phone") {
                activity.type = "PHONE";
            }
            else if (llemma === "email" || llemma === "write") {
                activity.type = "EMAIL";
            }
            else if (llemma === "meet" || llemma === "see") {
                activity.type = "MEETING";
            }
        }
    });

    return activity;
}

const parseEntities = (activity, entities) => {
    entities.forEach(entity => {

        // check for activity type from entity only if not detected yet
        if (activity.type === "PERSONAL") {
            activity.type = parseActivityType(entity, activity.type);
        } 

        if (entity.type === "PERSON") {
            activity.persons.push(entity.name);
        }

        if (entity.type === "ORGANIZATION") {
            activity.organization = entity.name;
        }

        // check sentiment
        if (entity.sentiment.magnitude > 0.3) {
            activity.sentiment = entity.sentiment.score > 0? "GOOD" : "BAD";
        }
    });

    return activity;
}

const parseTimes = (times) => {
    let result = {"time": "", "date": ""};
    times.forEach(time => {
        if (time.start) {
            if (time.start.knownValues.day) {
                result.date = chrono.casual.parseDate(time.start.knownValues.year + '-' + 
                                                    time.start.knownValues.month + '-' + 
                                                    time.start.knownValues.day);
            }
            else if (time.start.knownValues.hour) {
                result.time = time.start.knownValues.hour + ":" + time.start.knownValues.minute;
            }
        }
    });

    return result;
}


module.exports = async (text) => {
    let activity = {
        "type": "PERSONAL",
        "persons": [],
        "organization": "",
        "sentiment": ""
    }

    const lsClient = new language.LanguageServiceClient();

    const document = {
      content: text,
      type: 'PLAIN_TEXT',
    };
  
    // Parse activity for syntax
    const [syntax] = await lsClient.analyzeSyntax({document});
    activity = parseActivityTypeFromSyntax(activity, syntax.tokens);

    // Detects entities in the document
    const [result] = await lsClient.analyzeEntitySentiment({document});
    activity = parseEntities(activity, result.entities);

    // Detects time in the document
    let timeResult = parseTimes(chrono.parse(text));
    activity.time = timeResult.time;
    activity.followUpDate = timeResult.date;

    return activity;
}
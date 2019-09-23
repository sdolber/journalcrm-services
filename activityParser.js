const chrono = require('chrono-node');
const language = require('@google-cloud/language');

const parseActivityType = (entity, previousType) => {

    if (entity.type === "WORK_OF_ART" && entity.name.toLowerCase() === "email") {
        return "EMAIL";
    }

    if (entity.type === "EVENT") {
        return "MEETING";
    }

    if (entity.type === "OTHER" && (entity.name.toLowerCase() === "phone call" || entity.name.toLowerCase() === "call")) {
        return "PHONE";
    }

    return previousType;
}

const parseEntities = (entities) => {
    let activity = {
        "type": "PERSONAL",
        "persons": [],
        "organization": "",
        "sentiment": ""
    }

    entities.forEach(entity => {
        // check for activity type
        activity.type = parseActivityType(entity, activity.type);

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
    let activity = {};

    const lsClient = new language.LanguageServiceClient();

    const document = {
      content: text,
      type: 'PLAIN_TEXT',
    };
  
    // Detects entities in the document
    const [result] = await lsClient.analyzeEntitySentiment({document});
    activity = parseEntities(result.entities);


    // Detects time in the document
    let timeResult = parseTimes(chrono.parse(text));
    activity.time = timeResult.time;
    activity.followUpDate = timeResult.date;

    return activity;
}
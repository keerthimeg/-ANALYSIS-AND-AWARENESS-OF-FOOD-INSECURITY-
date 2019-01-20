/*
/* eslint-disable  func-names */
/* eslint-disable  no-console */
/*
const Alexa = require('ask-sdk');

const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent');
  },
  handle(handlerInput) {
    const factArr = data;
    const factIndex = Math.floor(Math.random() * factArr.length);
    const randomFact = factArr[factIndex];
    const speechOutput = GET_FACT_MESSAGE + randomFact;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const SKILL_NAME = 'Space Facts';
const GET_FACT_MESSAGE = 'Here\'s your fact: ';
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const data = [
  'A year on Mercury is just 88 days long.',
  'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
  'Venus rotates counter-clockwise, possibly because of a collision in the past with an asteroid.',
  'On Mars, the Sun appears about half the size as it does on Earth.',
  'Earth is the only planet not named after a god.',
  'Jupiter has the shortest day of all the planets.',
  'The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.',
  'The Sun contains 99.86% of the mass in the Solar System.',
  'The Sun is an almost perfect sphere.',
  'A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.',
  'Saturn radiates two and a half times more energy into space than it receives from the sun.',
  'The temperature inside the Sun can reach 15 million degrees Celsius.',
  'The Moon is moving approximately 3.8 cm away from our planet every year.',
];

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetNewFactHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
*/

const Alexa = require("ask-sdk-core");
const Request = require("request-promise");
var xml2js = require('xml2js');
const appId = "R0X8XmkrqGeeWsrayVQ3";
const appCode = "fYS6RJLjs1la9GuNWHhyYg";

var skill;

exports.handler = async (event, context) => { };
const AboutHandler = {
  canHandle(input) {
    return input.requestEnvelope.request.type === "LaunchRequest";


  },
  handle(input) {
    console.log('we are in swamphacks 1');
    return input.responseBuilder
      .speak("Feeding America is a United States based nonprofit organization which is a network of more than 200 food banks ")
      .withSimpleCard("Feeding America is a United States based nonprofit organization which is a network of more than 200 food banks ")
      .getResponse();
    //.withShouldEndSession(false);

  }
}


const getPostalCode = async (query) => {
  try {
    var result = await Request({
      uri: "https://geocoder.cit.api.here.com/6.2/geocode.json",
      qs: {
        "app_id": "vxdtbzfvCMMuJ53JHYMO",
        "app_code": "kN1srMv22SPHvIIJdREgPw",
        "searchtext": query,
        "gen": 8,
        "additionaldata": "IncludeShapeLevel,postalCode"
      },
      json: true
    });
    console.log('we are in swamphacks' + query)
    if (result.Response.View.length > 0 && result.Response.View[0].Result.length > 0) {
      return result.Response.View[0].Result[0].Location.Address.PostalCode;
    } else {
      throw "No results were returned";
    }
  } catch (error) {
    throw error;
  }
}

const GeocodeHandler = {
  canHandle(input) {
    console.log(input.requestEnvelope.request)
    //return input.requestEnvelope.request.type === "IntentRequest" && input.requestEnvelope.request.intent.name === "GeocodeIntent";
    return input.requestEnvelope.request.type === "IntentRequest" && input.requestEnvelope.request.intent.name === "GeocodeIntent";
  },
  async handle(input) {
    try {
      var postalCode = await getPostalCode((input.requestEnvelope.request && input.requestEnvelope.request.intent && input.requestEnvelope.request.intent.slots && input.requestEnvelope.request.intent.slots.Query.value ) ? input.requestEnvelope.request.intent.slots.Query.value : "Gainesville");
      console.log('we are in swamphacks 4444')
      var locationxml = await Request({
        uri: "https://ws2.feedingamerica.org/fawebservice.asmx/GetOrganizationsByZip",
        qs: {
          "zip": postalCode
        },
        json: true
      });
      console.log('we are in swamphacks 768787');

      var options = {  // options passed to xml2js parser

        explicitCharkey: false, // undocumented
        trim: false,            // trim the leading/trailing whitespace from text nodes
        normalize: false,       // trim interior whitespace inside text nodes
        explicitRoot: false,    // return the root node in the resulting object?
        emptyTag: null,         // the default value for empty nodes
        explicitArray: true,    // always put child nodes in an array
        ignoreAttrs: false,     // ignore attributes, only create text nodes
        mergeAttrs: false,      // merge attributes and child elements
        validator: null         // a callable validator
      };
      var parser = new xml2js.Parser(options);
      parser.parseString(locationxml, function (e, r) {
        error = e;
        parsedxml = r;
      });
      console.log('we are in swamphacks 657')
      var name = parsedxml.Organization[0].FullName[0].replace("&","and")
      var streetName = parsedxml.Organization[0].MailAddress[0].Address1[0]
      var cityName = parsedxml.Organization[0].MailAddress[0].City[0]
      var stateName = parsedxml.Organization[0].MailAddress[0].State[0]
      var zipCode = parsedxml.Organization[0].MailAddress[0].Zip[0]
      var fullString = "Nearest Food Bank is " + name + " and is located at " + streetName + ", " + cityName + ", " + stateName + " " + zipCode
      console.log('we are in swamphacks 6nhhb57')
      return input.responseBuilder
        .speak(fullString)
        .withSimpleCard("Address Position", fullString)
        .getResponse();

    } catch (error) {
      throw error;

    }
  }
}

const AboutWastedfoodHandler = {
  canHandle(input) {
    return input.requestEnvelope.request.type === "IntentRequest" && input.requestEnvelope.request.intent.name === "Wastedfood";


  },
  handle(input) {
    console.log('we are in swamphacks 1');
    return input.responseBuilder
      .speak("3200 pounds of food was wasted in the last 30 days")
      .withSimpleCard("Wastedfood", "200 pounds of food was wasted in the last 30 days")
      .getResponse();
    //.withShouldEndSession(false);

  }
}

const AboutFoodInsecurityHandler = {
  canHandle(input) {
    return input.requestEnvelope.request.type === "IntentRequest" && input.requestEnvelope.request.intent.name === "FoodInsecurity";


  },
  handle(input) {
    console.log('we are in swamphacks 1');
    return input.responseBuilder
      .speak("50719 people are food insecure in the alachua county of florida")
      .withSimpleCard("Foodinsecure", "50719 people are food insecure in the alachua county of florida")
      .getResponse();
    //.withShouldEndSession(false);

  }
}

const AboutTweeterHandler = {
  canHandle(input) {
    return input.requestEnvelope.request.type === "IntentRequest" && input.requestEnvelope.request.intent.name === "TwitterIntent";


  },
  handle(input) {
    console.log('we are in swamphacks 1');
    return input.responseBuilder
      .speak("821 million people are hungry every day yet the produces enough food to feed everyone")
      .withSimpleCard("Tweets", "821 million people are hungry every day yet the produces enough food to feed everyone")
      .getResponse();
    //.withShouldEndSession(false);

  }
}

//const handlers=[AboutHandler,GeocodeHandler];
exports.handler = async (event, context) => {
  if (!skill) {
    skill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(AboutHandler, GeocodeHandler, AboutTweeterHandler, AboutFoodInsecurityHandler, AboutWastedfoodHandler
      )
      .addErrorHandlers(ErrorHandler)
      .create();
  }
  var response = await skill.invoke(event, context);
  return response;
};
const ErrorHandler = {
  canHandle(input) {
    return true;
  },
  handle(input) {
    console.log('we are in swamphacks 6')
    return input.responseBuilder
      .speak("Sorry, I couldn't understand what you asked. Please try again.")
      .reprompt("Sorry, I couldn't understand what you asked. Please try again.")
      .getResponse();


  }
}
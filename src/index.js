/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

var Alexa = require('alexa-sdk');

var states = {
    STARTMODE: '_STARTMODE',                // Prompt the user to start or restart the game.
    ASKMODE: '_ASKMODE',                    // Alexa is asking user the questions.
    DESCRIPTIONMODE: '_DESCRIPTIONMODE'     // Alexa is describing the final choice and prompting to start again or quit
};


// Questions
var nodes = [{ "node": 1, "message": "What would you like to ask Dan McCready about? You can say things like education, jobs, or health care", "education": 2, "jobs": 3, "health care": 4, "why run for congress": 5},


// Answers & descriptions
             { "node": 2, "We need to make education a priority.  We have to give more pay and respect to teachers, and to treat them as the professionals they are. Among the top priorities are increasing teacher pay, reversing cuts to textbooks and school buses, and stopping teacher assistant lay-offs. Teachers will ultimately know we respect them when our policy reflects our rhetoric.  Reinstating a teaching fellows program to attract the best and brightest, providing opportunities for teachers to improve their skills as professionals, and making sure their kids are healthy and ready to learn in the classroom are vital. North Carolina already ranks 46th in the country and last in the Southeast in per-pupil expenditures for public schools. Many good teachers are leaving for other states for better jobs, and class size has increased. That’s causing parents to lose faith in public schools and undermining North Carolina’s best jobs recruiting tool, our education system. Similarly, I oppose vouchers that drain money from public schools. I support strong standards and openness for all schools, particularly charter schools. While some charters are strong, we see troubling trends, such as a re-segregation of the student population, or misuse of state funds without a way to make the wrongdoers reimburse taxpayers. We need to manage the number of charter schools to ensure we don’t damage public education and we need to better measure charter schools so we can utilize good ideas in all schools. We must support early childhood education as well as our great universities and community colleges. Our approach to quality education must be comprehensive."},
             { "node": 3, "I am running for Congress in the 9th district because it is time that North Carolina works for everyone, not just the select few.  I am concerned that as unemployment begins to drop, wages are not beginning to rise. I believe we have made budget and tax decisions that have been driven more by ideology than by sound thinking on how to grow the economy and create more opportunity. I know that we can do better. We need a new set of priorities that focuses on rising incomes, putting more money in the pockets of working families, and helping small businesses start up and grow. Small businesses are a vital component of our economy. While some of the biggest companies, including out-of-state corporations, have received tremendous giveaways, many of our small businesses and working families have seen tax increases, sometimes disguised as fees.  Some believe that we should zero out the corporate tax and income tax in favor of much higher sales taxes, gas taxes, and a host of fee hikes.   I think that would harm our economy and put our state at a disadvantage.  Moreover, I am concerned about an economic development plan that focuses mostly on lower corporate taxes instead of having a real, holistic plan to streamline regulations, invest in our workforce, create a fair but low tax environment, and recruit, retain, and start up businesses in the biggest growth sectors of our economy."},
             { "node": 4, "North Carolinians should be able to get a doctor’s help when they need it without breaking the bank. I am appalled by North Carolina’s failure to expand Medicaid to its neediest residents, especially when our tax dollars are already going to pay for it in other states. Republican governors nationwide have said yes to health care for the working poor, why not North Carolina? I remain concerned about the rising cost of health care and the consolidation of health care providers across our state, especially in underserved areas. Expanding Medicaid would give us more providers and an economic boost from jobs."},
             { "node": 5, "I'm running for Congress because I have children and when my children get older and learn about the crazy year 2017, they're going to ask me.. what did you, dad?"}
];

// this is used for keep track of visted nodes when we test for loops in the tree
var visited;

// These are messages that Alexa says to the user during conversation

// This is the intial welcome message
var welcomeMessage = "Welcome! Would you like to get to know Dan McCready?";

// This is the message that is repeated if the response to the initial welcome message is not heard
var repeatWelcomeMessage = "Welcome! Would you like to get to know Dan McCready?";

// this is the message that is repeated if Alexa does not hear/understand the reponse to the welcome message
var promptToStartMessage = "Say yes to continue, or no to stop.";

// This is the prompt to ask the user if they would like to hear a short description of thier chosen profession or to play again
var playAgainMessage = "What would you like to ask Dan McCready about? You can say things like education, jobs, or health care?";

// this is the help message during the setup at the beginning of the game
var helpMessage = "I will ask you some questions that will identify what you would be best at. Want to start now?";

// This is the goodbye message when the user has asked to quit the game
var goodbyeMessage = "Thanks for stopping by! You can read more on my policies at danmccready.com. Be sure to follow me on FaceBook and Twitter for up to the minute updates from the trail!";

var speechNotFoundMessage = "Hmm.. I didn't get that. You can say things like education, jobs, or health care";

var nodeNotFoundMessage = "Hmm.. I didn't get that. You can say things like education, jobs, or health care";

var descriptionNotFoundMessage = "Hmm.. I didn't get that. You can say things like education, jobs, or health care";

var utterancePlayAgain = "ask another question";

// the first node that we will use
var START_NODE = 1;

// --------------- Handlers -----------------------

// Called when the session starts.
exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandler, startGameHandlers, askQuestionHandlers, descriptionHandlers);
    alexa.execute();
};

// set state to start up and  welcome the user
var newSessionHandler = {
  'LaunchRequest': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
  },'AMAZON.HelpIntent': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', helpMessage, helpMessage);
  },
  'Unhandled': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', promptToStartMessage, promptToStartMessage);
  }
};

// --------------- Functions that control the skill's behavior -----------------------

// Called at the start of the game, picks and asks first question for the user
var startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'AMAZON.YesIntent': function () {

        // set state to asking questions
        this.handler.state = states.ASKMODE;

        // ask first question, the response will be handled in the askQuestionHandler
        var message = helper.getSpeechForNode(START_NODE);

        // record the node we are on
        this.attributes.currentNode = START_NODE;

        // ask the first question
        this.emit(':ask', message, message);
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
         this.emit(':ask', promptToStartMessage, promptToStartMessage);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpMessage, helpMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', promptToStartMessage, promptToStartMessage);
    }
});


// user will have been asked a question when this intent is called. We want to look at their yes/no
// response and then ask another question. If we have asked more than the requested number of questions Alexa will
// make a choice, inform the user and then ask if they want to play again
var askQuestionHandlers = Alexa.CreateStateHandler(states.ASKMODE, {
    
         'AMAZON.YesIntent': function () {
        // Handle Yes intent.
        helper.Jobs(this,'yes');
        
    },    'AMAZON.NoIntent': function () {
        // Handle Yes intent.
        helper.Jobs(this,'no');
    },
    'AMAZON.JobsIntent': function () {
        // Handle Yes intent.
        helper.Jobs(this,'jobs');
    },
    'AMAZON.EducationIntent': function () {
        // Handle No intent.
         helper.Education(this, 'education');
    },
        'AMAZON.HealthIntent': function () {
        // Handle No intent.
         helper.HealthCare(this, 'health care');
    },
        'AMAZON.WhyIntent': function () {
        // Handle No intent.
         helper.Why(this, 'why run for congress');
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
    }
});


// --------------- Helper Functions  -----------------------

var helper = {

    // gives the user more information on their final choice
    giveDescription: function (context) {

        // get the speech for the child node
        var description = helper.getDescriptionForNode(context.attributes.currentNode);
        var message = description + ', ' + repeatWelcomeMessage;

        context.emit(':ask', message, message);
    },

    // logic to provide the responses to the yes or no responses to the main questions
    yesOrNo: function (context, reply) {

        // this is a question node so we need to see if the user picked yes or no
        var nextNodeId = helper.getNextNode(context.attributes.currentNode, reply);

        // error in node data
        if (nextNodeId == -1)
        {
            context.handler.state = states.STARTMODE;

            // the current node was not found in the nodes array
            // this is due to the current node in the nodes array having a yes / no node id for a node that does not exist
            context.emit(':tell', nodeNotFoundMessage, nodeNotFoundMessage);
        }

        // get the speech for the child node
        var message = helper.getSpeechForNode(nextNodeId);

        // have we made a decision
        if (helper.isAnswerNode(nextNodeId) === true) {

            // set the game state to description mode
            context.handler.state = states.DESCRIPTIONMODE;

            // append the play again prompt to the decision and speak it
            message = decisionMessage + ' ' + message + ' ,' + playAgainMessage;
        }

        // set the current node to next node we want to go to
        context.attributes.currentNode = nextNodeId;

        context.emit(':ask', message, message);
    },

    // gets the description for the given node id
    getDescriptionForNode: function (nodeId) {

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                return nodes[i].description;
            }
        }
        return descriptionNotFoundMessage + nodeId;
    },

    // returns the speech for the provided node id
    getSpeechForNode: function (nodeId) {

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                return nodes[i].message;
            }
        }
        return speechNotFoundMessage + nodeId;
    },

    // checks to see if this node is an choice node or a decision node
    isAnswerNode: function (nodeId) {

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                if (nodes[i].yes === 0 && nodes[i].no === 0) {
                    return true;
                }
            }
        }
        return false;
    },

    // gets the next node to traverse to based on the yes no response
    getNextNode: function (nodeId, yesNo) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                if (yesNo == "yes") {
                    return nodes[i].yes;
                }
                return nodes[i].no;
            }
        }
        // error condition, didnt find a matching node id. Cause will be a yes / no entry in the array but with no corrosponding array entry
        return -1;
    },

    // Recursively walks the node tree looking for nodes already visited
    // This method could be changed if you want to implement another type of checking mechanism
    // This should be run on debug builds only not production
    // returns false if node tree path does not contain any previously visited nodes, true if it finds one
    debugFunction_walkNode: function (nodeId) {

        // console.log("Walking node: " + nodeId);

        if( helper.isAnswerNode(nodeId) === true) {
            // found an answer node - this path to this node does not contain a previously visted node
            // so we will return without recursing further

            // console.log("Answer node found");
             return false;
        }

        // mark this question node as visited
        if( helper.debugFunction_AddToVisited(nodeId) === false)
        {
            // node was not added to the visited list as it already exists, this indicates a duplicate path in the tree
            return true;
        }

        // console.log("Recursing yes path");
        var yesNode = helper.getNextNode(nodeId, "yes");
        var duplicatePathHit = helper.debugFunction_walkNode(yesNode);

        if( duplicatePathHit === true){
            return true;
        }

        // console.log("Recursing no");
        var noNode = helper.getNextNode(nodeId, "no");
        duplicatePathHit = helper.debugFunction_walkNode(noNode);

        if( duplicatePathHit === true){
            return true;
        }

        // the paths below this node returned no duplicates
        return false;
    },

    // checks to see if this node has previously been visited
    // if it has it will be set to 1 in the array and we return false (exists)
    // if it hasnt we set it to 1 and return true (added)
    debugFunction_AddToVisited: function (nodeId) {

        if (visited[nodeId] === 1) {
            // node previously added - duplicate exists
            // console.log("Node was previously visited - duplicate detected");
            return false;
        }

        // was not found so add it as a visited node
        visited[nodeId] = 1;
        return true;
    }
};

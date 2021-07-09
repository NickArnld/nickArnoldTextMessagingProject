const fs = require('fs');
const inquirer = require('inquirer');
const companiesJSON = require('./data/Companies.json');
const guestJSON = require('./data/Guests.json');
const messageJSON = require('./data/Messages.json');

inquirer
    .prompt({
        type: "list",
        name: "choice",
        message: "What would you like to do today?",
        choices: ["Send a message", "Create new message"]
    })
    .then((answers)=>{
        if(answers.choice === "Send a message"){
            let storageObj = {
                guestID: "",
                hotelID: "",
                messageID: "",
                greeting: ""
            }
            messageSelector(storageObj)
        }else if(answers.choice === "Create new message"){
            let newMsgObj = {
                id: "",
                description: answers.description,
                text: "",
                msgVariables: []
            }
            newMessageDescription(newMsgObj);
        }
    })
    .catch((err)=>{
        console.log(err);
    })

//handles message selection from available messages
function messageSelector(storageObj){
    let choicesArr = []

    for (let i = 0; i<messageJSON.length;i++){
        let choiceObj = {
            name: messageJSON[i].description,
            value: messageJSON[i].id
        }
        choicesArr.push(choiceObj);
    }

    inquirer
    .prompt({
        type: "list",
        name: "message",
        message: "Which message would you like to send?",
        choices: choicesArr
    })
    .then((answer)=>{
        storageObj.messageID = answer.message;
        guestSelector(storageObj);
    })
    .catch((err)=>{
        console.log(err);
    })
};

//handles guest selection from guest data
function guestSelector(storageObj){
    let guestChoiceArr = []

    for (let i = 0; i<guestJSON.length;i++){
        let choiceObj = {
            name: guestJSON[i].firstName + " " + guestJSON[i].lastName,
            value: guestJSON[i].id,
        }
        guestChoiceArr.push(choiceObj);
    }

    inquirer
    .prompt({
        type: "list",
        name: "guestID",
        message: "Which guest would you like to send this message to?",
        choices: guestChoiceArr
    })
    .then((answer)=>{
        storageObj.guestID = answer.guestID;
        hotelSelector(storageObj);
    })
    .catch((err)=>{
        console.log(err);
    })
}

//handles hotel selection from hotel data
function hotelSelector(storageObj){
    let hotelChoiceArr = []

    for (let i = 0; i<companiesJSON.length;i++){
        let choiceObj = {
            name: companiesJSON[i].company,
            value: companiesJSON[i].id,
        }
        hotelChoiceArr.push(choiceObj);
    }

    inquirer
    .prompt({
        type: "list",
        name: "hotelID",
        message: "Which hotel is this guest staying at?",
        choices: hotelChoiceArr
    })
    .then((answer)=>{
        storageObj.hotelID = answer.hotelID;
        greetingHandler(storageObj);
    })
    .catch((err)=>{
        console.log(err);
    })
}

//sets greeting message based on time of day
function greetingHandler(storageObj){
    //5am to noon is morning, noon to 6pm is afternoon, 6pm to 5am is night
    let hours = new Date().getHours();

    if(hours >=5 && hours <= 11){
        //morning
        storageObj.greeting = "Good morning"
    }else if(hours >= 12 && hours < 18){
        //afternoon
        storageObj.greeting = "Good afternoon"
    }else{
        //night
        storageObj.greeting = "Good evening"
    }
    
    //Run Message Creator function passing along storageOBJ
    messageBuilder(storageObj);
}

//builds message with all selected data
function messageBuilder(storageObj){
    let guestObj = {};
    let hotelObj = {};
    let messageObj = {};

    for(let x = 0; x<guestJSON.length; x++){
        if(guestJSON[x].id === storageObj.guestID){
            guestObj = guestJSON[x];
        }
    }

    for(let y = 0; y<companiesJSON.length; y++){
        if(companiesJSON[y].id === storageObj.hotelID){
            hotelObj = companiesJSON[y];
        }
    }

    for(let z = 0; z<messageJSON.length; z++){
        if(messageJSON[z].id === storageObj.messageID){
            messageObj = messageJSON[z];
        }
    }

    let messageStr = messageObj.text;
    let messageVars = messageObj.msgVariables;

    for(let i = 0; i < messageVars.length;i++){
        let replacement = messageVars[i];
        if(replacement === "greetingMessage"){
            messageStr = messageStr.replace(/greetingMessage/g, storageObj.greeting);
        }else if(replacement === "guestFirstName"){
            messageStr = messageStr.replace(/guestFirstName/g, guestObj.firstName);
        }else if(replacement === "guestLastName"){
            messageStr = messageStr.replace(/guestLastName/g, guestObj.lastName);
        }else if(replacement === "roomNumber"){
            messageStr = messageStr.replace(/roomNumber/g, guestObj.reservation.roomNumber);
        }else if(replacement === "hotelName"){
            messageStr = messageStr.replace(/hotelName/g, hotelObj.company);
        }else if(replacement === "hotelCity"){
            messageStr = messageStr.replace(/hotelCity/g, hotelObj.city);
        }
    }

    console.log("\n Here's your finished message: \n \n " + messageStr + "\n");
}

//asks for input for new message description
function newMessageDescription(newMsgObj){
    inquirer
    .prompt({
        type: "input",
        name: "description",
        message: "So that we can easily send this message later, please type a description of the new message.",
    })
    .then((answers)=>{
        newMsgObj.description = answers.description;
        newMessageVariables(newMsgObj);
    })
    .catch((err)=>{
        console.log(err);
    })
};

//asks for information that will be included in the message so it can be easily filled in later.
function newMessageVariables(newMsgObj){
    inquirer
    .prompt({
        type: "checkbox",
        name: "vars",
        message: "Please select the information you would like your new message to contain. \n *Note: a greeting followed by the guests name will be added to the beginning of all messages",
        choices: ["Their room number","The name of the hotel","The city where the hotel is located"]
    })
    .then((answers)=>{
        let newArr = ["greetingMessage","guestFirstName"];
        let newStr = "";
        for(let i = 0;i<answers.vars.length;i++){
            if(answers.vars[i] === "Their room number"){
                newArr.push("roomNumber");
                newStr += "*" + answers.vars[i] + " = roomNumber \n ";
            }else if(answers.vars[i] === "The name of the hotel"){
                newArr.push("hotelName");
                newStr += "*" + answers.vars[i] + " = hotelName \n ";
            }else if(answers.vars[i] === "The city where the hotel is located"){
                newArr.push("hotelCity");
                newStr += "*" + answers.vars[i] + " = hotelCity \n ";
            }
            
        }
        newMsgObj.msgVariables = newArr;
        // console.log(newStr);
        newMessageText(newMsgObj, newStr, newArr);
    })
    .catch((err)=>{
        console.log(err);
    })
};

//Asks for text input that will be included in the message, and provides user with the key words to use.
function newMessageText(newMsgObj, choicesStr, choicesArr){

    inquirer
    .prompt({
        type: "input",
        name: "text",
        message: `Please type out what you would like your message to say. \n For the info you would like to include please use the following keywords: \n ${choicesStr}*Note: a greeting followed by the guests name will be added to the beginning of all messages \n`,
    })
    .then((answers)=>{
        let finalText = "greetingMessage guestFirstName " + answers.text;
        let check = keyWordChecker(finalText, choicesArr);
        if(!check){
            console.log("We're sorry you are missing or misspelled one of the keywords, please try typing it again. If you changed your mind about including some information please start over.\n");
            newMessageText(newMsgObj, choicesStr, choicesArr);
        }else{
            newMsgObj.text = finalText;
            messageSaver(newMsgObj);
        }
    })
    .catch((err)=>{
        console.log(err);
    })
};

//checks the new message for all chosen keywords
function keyWordChecker(text, msgVars){
    for(let i = 2; i<msgVars.length;i++){
        if(!text.includes(msgVars[i])){
            return false;
        }
    }
    return true
}

function messageSaver(newMsgObj){
    newMsgObj.id = messageJSON.length + 1;
    messageJSON.push(newMsgObj);
    fs.writeFile("./data/Messages.json", JSON.stringify(messageJSON, null, 3) , (err)=>{
        if(err){
            return console.log(err);
        }
        console.log("Your new message has been saved! Restart the program to send it!")
    });
}
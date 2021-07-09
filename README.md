Nick Arnold's Messaging Program

Instructions:

1) Before running the program: in the terminal change directories to the folder for this project and run "npm install" in order to download the required modules.

2) After installing the required packages, type "node index.js" to start the program.

3) Use the command line interface to pick either "Send a message" or "Create new message". *Use your up and down arrows to navigate and press enter when you land on the one you would like to choose, this is how you will navigate most lists going forward unless staed otherwise*

    Send a Message:

    1) When you select "Send a message", the program will then ask you to choose from a list of descriptions for pre-saved messages. Choose the one you would like to send!

    2) It will then ask you to choose which guest you would like to send your chosen message to, select one.

    3) Finally it will ask which hotel your chosen guest is staying at, select one and your message will appear with the relevant information filled in!

    Create a Message:

    1) After you select "Create a new message" type a short description of the message you would like to create.

    2) Then select the relevant information you would like to include in your new message. *Scroll through this list with the up and down arrow keys, and use space bar to select on or multiple options.*

    3) Next type out exactly how you would like the message to be worded. Key words will be provided (based on your choices from the previous question) to be used in the place of things like the guests room number and the name of the hotel. 

    4) Hit enter and the program will check that you have entered the correct key words and will save your message. Restart the program to send your newly created message!

Design Decisions/Discussion:

I chose to make this program in Node.js because its what I'm most familiar with, and it handles JSON data naturally. I used a command line interface because it is fast to make and easy to use. The package I used for the CLI is inquirer.js because it has many options for different questions and inputs. The general flow of the program is feeding an object through a variety of functions. I could have made global objects and filled them with the neccesary data along the way, but my method seemed to me to be a good option considering how inquirer.js returns its answers. For the messages I set it up so that each message starts with a greeting followed by the chosen guests name. I thought this would make it easier for the user when it came time to enter key words. 

I verfifed my program by testing it a lot. I misspelled keywords, created empty message objects in the message.json file, etc. 

I would've liked to add a feature where you could go back in the questions if you changed your mind, but did not have time. I also wouldve liked to add a feature where you could go back to the begining of the program after working through the different options of sending or creating a message. The fact that every message begins with a greeting followed by the guests name is limiting for what kind of messages you can send, so if I could revisit this I would change that. 
# Leaflet Serever (Support Android & Web App)
Liad Brettler & Eden Berman

## Description
In this project, we developed an Android application that retains the webpage functionality. The application consists of multiple components, including a server with a RESTful API, a MongoDB database for data storage, and a client-side interface that enhances the user experience. The primary objective was to create an Android application to facilitate real-time communication among users. The core feature of the application is a chat system, which encompasses three main activities: a Login screen, a Register screen, and a Chats screen.

In the Android app, the Chats functionality is divided into two distinct activities: a contact list and a selected chat. This is a deviation from the Chats webpage. Additionally, the Android app utilizes a local SQLite database, implemented through Room, to store a local copy of relevant data such as chat messages and the contact list. The local database is continuously updated in the background through server synchronization, ensuring that the visual representation of the data remains up to date.

## Instructions
This repository includes both the updated server and the original web client implementation, which is designed to work in conjunction with a server that implements the same API.
If you wish to access the repository that exclusively contains the Android client-side, please click the following link: https://github.com/Brettler/Leaflet_Android.git

To run the Android application using our server, follow these steps:

1. Redirect to the provided link and clone the repository.
2. Navigate to the directory where the files are located using your terminal.
3. Execute the command "npm install" to install the required dependencies.
4. Open your local MongoDB server and modify the URL section from 'localhost' to '127.0.0.1/leaflet', and click 'Connect'.
5. Proceed to the 'config' folder and edit the 'env.local' file to set the URL for your local MongoDB database. Ensure that the port number matches the one specified in your MongoDB server configuration. If necessary, you can modify the port number used by our server, by default set to '4656'.
6. Finally, enter the command "npm start" to start the server.

To run the Android client:

1. Clone the current repository into Android Studio.
2. Choose your device emulator.
3. Run app (green play button).
4. To connect the client to the server, open the CMD and run the following command: 'ipconfig'. Copy the IPv4 address.
5. Enter the emulator and in the login screen, click the button in the top right corner, and replace the address followed by the correct port number.

Note: if the server connection wasn't established properly, a network error will occur upon trying to register.

To run the web client:

Proceed to the browser and enter the MongoDB address, meaning 'localhost' or '127.0.0.1' with our server port number '4656'. The full link: 'http://127.0.0.1:4656'.

This will launch the app and open the login activity. This activity is the main interface where you can enter your username and password. After clicking on the "Login" button, registered users will be directed to their personalized Contact activity. If you haven't registered yet, click on the "Register" button, which will take you to the registration activity where you can provide your information. Once you have filled in all the required fields, click on the "Register" button to redirect to the login activity. You will stay logged into the app even upon exiting, unless you use the logout feature provided in the settings.

## Server
The server in this implementation adheres to the MVC (Model-View-Controller) architecture, comprising controllers, models, services, and routes. It implements the same API constructed in the previous assignment.

In addition, we have implemented a notification service using Firebase. When the server receives a message from a client, it distinguishes between Android users and webpage users by checking the login request's header sent by the client. If the header contains a Firebase token (FCM), the user is identified as an Android user; otherwise, the user is considered a web user. The Firebase token is then stored in MongoDB, allowing us to establish a mapping between the two user types.

When a client sends a message to the server, the server first checks the type of the user the message is directed to. Upon receiving a message to send, the server determines whether it should be directed to an Android user or a web user. If the message is intended for an Android user, the server utilizes Firebase to push the notification to the user's app. On the other hand, if the notification is meant for a web user, it is sent using SocketIO. Regardless of the user type, the logic remains the same: notifications are sent through Firebase, while messages are sent through the server.

## Client - Android Activities
* Login - The main activity of the application. It features a form with input boxes for the user's username and password. The screen also includes a login button that allow users to access their personal chat screen, and a register button which refers new users to the registration screen. To facilitate communication with the server, a button is located in the top right corner of the page. This button allows users to input the address of a specific server they wish to connect with. By default, our server address is already populated, ensuring a smooth initial experience for users.

* Register -This activity provides users with the ability to sign up for the app. It presents a form that includes mandatory fields such as username, password, password verification, and display name. Additionally, users have the option to upload a profile picture, although this step is not mandatory. To ensure the best results, it is recommended that the picture used should have a square, circle or horizontal rectangular aspect ratio. Upon filling out the form accurately, users can proceed by clicking the Register button, which will redirect them to the login screen. If users have already registered, they can simply click on the Login button, which will also lead them to the login screen.

* Contact - This activity serves as a contact list, where each contact represents a chat. Located in the bottom right corner of the screen is a button that, upon clicking, displays a popup. This popup provides three distinct options, each leading the user to different activities: profile, settings, and add friend.

* Profile - This activity provides users with the ability to view their personal details, including their profile picture, display name, and username.

* Settings - This activity offers users the ability to modify various features within the app. Firstly, users can switch between light mode and dark mode themes, with the app initially set to light mode by default. Secondly, users can change the server address to which the app connects, similar to the Login activity. Another important feature of this activity is the option for users to logout from their personal chat system. By logging out, the local data stored on the device will be deleted, while the server data remains unaffected. Logging out also serves as the only means for users to be redirected back to the Login or Register activities. If users simply exit the app without logging out and later return, they will be automatically directed to their personal contacts activity.

* Add Friend - This activity allows users to create a new chat by specifying the username of the friend they want to initiate the chat with.

* Chat - For each contact in the contact list, an individual chat activity is created. This activity is dedicated to displaying the messages exchanged between the user and the selected friend. The top bar of the activity includes the display name of the friend the user is currently chatting with. Each message displays the friend's profile picture. Additionally, the activity includes an icon designed specifically for deleting the currently displayed chat, and an icon for returning to the contact list.

Even when the app is closed, users will receive real-time notifications that include the app icon, the display name of the friend who sent the message, and the message contents.

## Client - Webpages
* Login - The main page of our app is the login page, which features a form with input boxes for the user's username and password. The page also includes buttons that allow users to access their personal chat page or the registration page. The username input box verifies whether the username is already registered, while the password box ensures that the entered password matches the username. If either of these fields is left blank or does not match, an error message will be displayed. Once the user enters the correct login credentials, they can access their personalized chat page by clicking on the "Login" button. If the user hasn't registered yet, they can click on the "Register" button, which will redirect them to the registration page.

* Register - The Register page of our app features a form that requires users to fill in mandatory fields such as username, password, password verification, and display name, while uploading a profile picture is optional. Certain fields have restrictions. The username must be unique in a case-insensitive manner. The password field must contain at least five characters, one digit, one uppercase letter, and one lowercase letter. Furthermore, the verify password field must match the password field. The display name field does not have any restrictions, but it is mandatory to fill it. Users can choose their profile picture, which will be previewed below as it would appear. If the user chooses not to upload an image, the default image will be displayed.
If any of the mandatory and restricted fields are not filled in properly, an appropriate error message will appear, and the user will not be able to register. Once the user completes the form, they can click on the Register button to be redirected to the login page. If the user has already registered, they can click on the right-hand link to be directed to the login page.

* Chats - The Chats page is personalized for each user and shows all of their ongoing conversations. Upon logging in, a welcome message from our team appears in the top right bar. The structure of the page is divided into two main sections.
    On the right side of the page, the chat window is displayed, with a bar above it and an input box below it. The top bar displays details of the friend the user is currently chatting with, including their profile picture and display name. Furthermore, it incorporates an icon specifically designed for the purpose of deleting the currently displayed chat. In the input box below, users can type their message and send it by clicking on the arrow button to the right. Once the user sends the message, it appears in a chat bubble in the chat window, along with the time it was sent.
    On the left side, users can see a list of friends they have ongoing conversations with. The top bar on this side displays the user's profile picture, display name, and features such as logging out and adding a new friend. Clicking on the 'Logout' icon redirects the user to the login page, while clicking on the 'Add Friend' icon brings up a modal where the user can enter another user's username (which is case-sensitive). Clicking 'Add Friend' will add the friend to the list. If the username is not registered, an error message appears. Clicking 'Close' closes the modal.
    Below this bar is the user's friend list, which initially appears empty. Once a friend is added, their profile picture and display name appear in the list. To start a conversation, users can simply click on the friend's box, which displays their details in the top bar on the right-hand side. From here, users can send a message to their friend. The last message sent will be displayed in the friend's details along with the time it was sent. Once a new message is received, the friend's name will be displayed in red indicating a new message has been sent.
    Between the user's details and the friend list is a search box that allows users to search for a specific friend within the list, in a case-insensitive manner. The list will only display friends whose display names contain the typed prefix, temporarily hiding the rest of the friends.

To ensure consistent and cohesive design throughout the app, each webpage has a corresponding CSS file that applies its unique design elements.

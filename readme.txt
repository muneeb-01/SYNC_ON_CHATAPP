//Frontend
1. first i setup the frontend with vite tailwindcss and shadcn ui and implement react router dom.
2. setup the three pages (auth, profile, chat)
3. create the user interface for signup and login 

//Backend
4. Then setup the backend using express, dotenv, jsonwebtoken, multer ,mongoose bcrypt and cors
5. setup the environment variables for cors port and mondodb connection
6. create the userModel and Router for signup and login routes and write their logic 

//Frontend
7. Then again in frontend setup the Lib>apiclient variable for sending api request using axios and also setup the utils>constant for routes 
8. create validatelogin and validate signup functions under auth>index.js Use apiclient and constant to send request and dont forget to write {withCredentials} under axios request
9. setup zustand for state management under Store folder create index.js import create and also create one slice for auth router and use it in your store>index.js
10. store responce data under zustand in authSlice (userInfo)
11. in app.js create the Private route and AuthRoute function to check the validity of user using userInfo from zustand authSlice.js
12. your /chat and /profile are private route so wrap it under <PrivateRoute><Chat/></PrivateRoute> and <PrivateRoute><Profile/></PrivateRoute> and auth route under <AuthRoute><Auth /></AuthRoute>
13. after that setup the profile UI to edit personal information like firestname, lastname and picture and also setup the delete function for picture 

//backend
14. Write the logic to recive user info to store it in database and before that check the validity of user 
15. create the uploads/profiles folder to store the profile pictures of the users and also store their url in database.
16. To achieve the 15. step first add profile picture and host from .env file in formdata and pass the formdata towards your server.

//backend
17. use static file from uploads/profiles
18. sended formdata efficiently use the host and store it in database with the complete url and also store the files with filename created by uuid:v4 
19. create one more route to delete your picture from database and also from your server 

//Frontend
20. setup the Chat Ui
21. add a search functionality in your chat-profile ui and also use a deboucing concept in to send the request after the half second of user stop typing to prevent unwanted requests
23. create a component to show all the searched users and when you click on any one of them you will redirect towards the chat container
22. Create a Zustand Slice For Current chat data like contact or group chat user2 info and then showcase it in the chat container to know with whom you are taking write now 

//Backend 
23. create a route to add the logic of searching in server and active user will not get its own name 
24. add a Sockect connect in my server and also store their userId on SockedId to check weather the user is online or not

//Frontend
25. Create a one more custum hook using useContext and Socket mainly to connect your client side to the server
26. create one message model in the server 
# Angry Tweets

## Scoring twitter accounts based on how angry they sound

Simple project where I was learning basics of ReactJS and Electron. 
- User can type the name of the twitter user and the React component will autofillt the name while its being typed using Twitter API to query the existing accounts. 
- The last 60 tweets are then get combined and sent to IBM Watson for sentiment anlysis
- The result from Watson's analysis, the anger score in particular, is then being presented to the user


<img src="Screenshots/UI.gif" height="600">

## Commands:
- <b>npm run compile</b>
- <b>npm run start</b>
- <b>npm run dist</b>  <i>// packaging</i>

## Under the hood
- Electron platform
- React (15)
- Twitter API
- IBM Watson API
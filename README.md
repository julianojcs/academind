![Juliano Costa](https://raw.githubusercontent.com/julianojcs/julianojcs.github.io/master/apfjuliano.dev.png)

# GraphQL, MongoDB - Build a Complete App with GraphQL, Nodejs, MongoDB and Reactjs

Learning GraphQL, Nodejs, MongoDB and Reactjs creating a Event Booking Application

This is the Part 1 of this project. 
The API made with GraphQL + NodeJS + MongoDB with user authenticated by JWT middleware.
Next step, making the React front-end...

## Config

* Clone the project:

```
1. git clone https://github.com/julianojcs/academind.git
2. cd academind
```

* Install the dependencies:

```
3. npm install
```

* Configure environments at nodemon.json file:

```
4. Rename "nodemon sample.json" to "nodemon.json"
5. Set MONGO_USER, MONGO_PASSWORD and MONGO_DB variables with your Database credentials and Database name
{
  "env": {
    "MONGO_USER": "myDbUserName",
    "MONGO_PASSWORD": "myDbPassword",
    "MONGO_DB": "myDbName"
  }
}
```

* Seting the server up:

```
5. npm start
```

Open the url [http://localhost:4000/](http://localhost:3000/) to make the tests requests:

##Test Queries at GraphQL's playground.
### You can find query examples into the /playground file.
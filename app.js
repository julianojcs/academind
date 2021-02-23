import express from 'express'
import bodyParser from 'body-parser'
import { graphqlHTTP } from 'express-graphql'
import mongoose from 'mongoose'
import schema from './graphql/schema'
import rootValue from './graphql/resolvers'
import isAuth from './middleware/is-auth'
// import moment from 'moment'

const app = express()
app.use(bodyParser.json())

app.use(isAuth)

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true //Playground on/off
  })
)

mongoose
  .connect(
    // `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.grsjv.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    'mongodb://localhost:27017/events-booking',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }
  )
  .then(() => {
    app.listen({ port: 3000 }, () =>
      console.log(
        `🚀 Server ready at http://localhost:3000 (${new Date().toLocaleString()})`
      )
    )
  })
  .catch((err) => {
    console.log(err)
  })
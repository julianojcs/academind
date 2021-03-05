import express from 'express'
import bodyParser from 'body-parser'
import { graphqlHTTP } from 'express-graphql'
import mongoose from 'mongoose'
import schema from './graphql/schema'
import rootValue from './graphql/resolvers'
import isAuth from './middleware/is-auth'
// import moment from 'moment'

const port = process.env.PORT

const app = express()

app.use(bodyParser.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})
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
    app.listen({ port }, () =>
      console.log(
        `🚀 Server ready at http://localhost:${port} (${new Date().toLocaleString()})`
      )
    )
  })
  .catch((err) => {
    console.log(err)
  })
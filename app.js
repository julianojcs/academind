import express from 'express'
import bodyParser from 'body-parser'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import mongoose from 'mongoose'
import Event from './models/event'
// import moment from 'moment'

const app = express()
app.use(bodyParser.json())

// moment.locale('pt-br')

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event!
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: () => {
        return Event.find()
        .then((events) => {
          return events.map(event => {
            // return { ...event._doc, date: moment(event._doc.date).format('LLLL')}
            return { ...event._doc, date: event._doc.date.toLocaleString()}
          })
        })
        .catch((err) => {
          console.log(err)
          throw err
        })  
      },
      createEvent: ({ eventInput }) => {
        // const { title, description, price, date } = eventInput
        const event = new Event(eventInput)
        return event.save()
        .then((result) => {
          console.log({...result._doc})
          return {...result._doc}
        })
        .catch((err) => {
          console.log(err)
          throw err
        })
      }
    },
    graphiql: true //Playground on/off
  })
)

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.grsjv.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }
  )
  .then(() => {
    app.listen({ port: 3000 }, () =>
      console.log(`🚀 Server ready at http://localhost:3000`)
    )
  })
  .catch((err) => {
    console.log(err)
  })



// app.listen({ port: 3000 }, () =>
// console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`)
// )

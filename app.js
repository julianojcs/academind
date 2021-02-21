import express from 'express'
import bodyParser from 'body-parser'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import mongoose from 'mongoose'
import Event from './models/event'
import User from './models/user'
import bcrypt from 'bcryptjs'

// import moment from 'moment'

const app = express()
app.use(bodyParser.json())

const events = (eventIds) => {
  return Event.find({ _id: { $in: eventIds } })
    .then((events) => {
      return events.map((event) => {
        return {
          ...event._doc,
          date: event._doc.date.toLocaleString(),
          creator: user.bind(this, event.creator)
        }
      })
    })
    .catch((err) => {
      throw err
    })
}

const user = (userId) => {
  return User.findById(userId)
    .then((user) => {
      return {
        ...user._doc,
        password: null,
        createdAt: user._doc.createdAt.toLocaleString(),
        createdEvents: events.bind(this, user._doc.createdEvents)
      }
    })
    .catch((err) => {
      throw err
    })
}

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
        creator: User!
      }
      type User {
        _id: ID!
        email: String!
        password: String
        createdAt: String!
        createdEvents: [Event!]
      }
      input EventInput {
        title: String!
        description: String!
        price: Float!
      }
      
      input UserInput {
        email: String!
        password: String!
      }
      type RootQuery {
        events: [Event!]!
      }
      type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
      }
      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: () => {
        return (
          Event.find()
            // .populate('creator')
            .then((events) => {
              return events.map((event) => {
                // return { ...event._doc, date: moment(event._doc.date).format('LLLL')}
                return {
                  ...event._doc,
                  date: event._doc.date.toLocaleString(),
                  creator: user.bind(this, event._doc.creator)
                }
              })
            })
            .catch((err) => {
              console.log(err)
              throw err
            })
        )
      },
      createEvent: ({ eventInput }) => {
        // const { title, description, price, date } = eventInput
        const event = new Event({
          ...eventInput,
          creator: '6032880b7500740544bc88f8'
        })
        let createdEvent
        return event
          .save()
          .then((result) => {
            createdEvent = {
              ...result._doc,
              creator: user.bind(this, result._doc.creator)
            }
            return User.findById('6032880b7500740544bc88f8')
          })
          .then((user) => {
            if (!user) {
              throw new Error('User not found!')
            }
            user.createdEvents.push(event)
            return user.save()
          })
          .then(() => {
            return createdEvent
          })
          .catch((err) => {
            console.log(err)
            throw err
          })
      },
      createUser: ({ userInput }) => {
        return User.findOne({ email: userInput.email })
          .then((user) => {
            if (user) {
              throw new Error('User exists already!')
            }
            return bcrypt.hash(userInput.password, 12)
          })
          .then((hashedPassword) => {
            const user = new User({
              ...userInput,
              password: hashedPassword
            })
            return user.save()
          })
          .then((result) => {
            console.log({ ...result._doc })
            return {
              ...result._doc,
              password: null,
              createdAt: result._doc.createdAt.toLocaleString()
            } //supress the password
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
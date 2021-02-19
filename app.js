import express from 'express'
import bodyParser from 'body-parser'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'

const app = express()
app.use(bodyParser.json())

const events = []

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
        date: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: () => {
        return events
      },
      createEvent: ({ eventInput }) => {
        const { title, description, price, date } = eventInput
        const event = {
          _id: Math.random().toString(),
          title,
          description,
          price: +price, //+ set the string variable to number
          date
        }
        events.push(event)
        return event
      }
    },
    graphiql: true //Playground on/off
  })
)

app.listen({ port: 3000 }, () =>
  console.log(`🚀 Server ready at http://localhost:3000`)
)

// app.listen({ port: 3000 }, () =>
// console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`)
// )

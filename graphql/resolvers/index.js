import Event from '../../models/event'
import User from '../../models/user'
import bcrypt from 'bcryptjs'

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } })
    return events.map((event) => {
      return {
        ...event._doc,
        date: event._doc.date.toLocaleString(),
        creator: user.bind(this, event.creator)
      }
    })
  } catch (err) {
    throw err
  }
}

const user = async (userId) => {
  try {
    const user = await User.findById(userId)
    return {
      ...user._doc,
      password: null,
      createdAt: user._doc.createdAt.toLocaleString(),
      createdEvents: events.bind(this, user._doc.createdEvents)
    }
  } catch (err) {
    throw err
  }
}

module.exports = {
  events: async () => {
    try {
      const events = await Event.find()
      // .populate('creator')
      return events.map((event) => {
        // return { ...event._doc, date: moment(event._doc.date).format('LLLL')}
        return {
          ...event._doc,
          date: event._doc.date.toLocaleString(),
          creator: user.bind(this, event._doc.creator)
        }
      })
    } catch (err) {
      throw err
    }
  },
  createEvent: async ({ eventInput }) => {
    // const { title, description, price, date } = eventInput
    const event = new Event({
      ...eventInput,
      creator: '6032fb70686b26227c62a8e5'
    })
    let createdEvent
    try {
      const result = await event.save()
      createdEvent = {
        ...result._doc,
        creator: user.bind(this, result._doc.creator)
      }
      const creator = await User.findById('6032fb70686b26227c62a8e5')

      if (!creator) {
        throw new Error('User not found!')
      }
      creator.createdEvents.push(event)
      await creator.save()

      return createdEvent
    } catch (err) {
      throw err
    }
  },
  createUser: async ({ userInput }) => {
    try {
      let user = await User.findOne({ email: userInput.email })

      if (user) {
        throw new Error('User exists already!')
      }
      const hashedPassword = await bcrypt.hash(userInput.password, 12)

      user = new User({
        ...userInput,
        password: hashedPassword
      })

      const result = await user.save()

      return {
        ...result._doc,
        password: null,
        createdAt: result._doc.createdAt.toLocaleString()
      } //supress the password
    } catch (err) {
      throw err
    }
  }
}

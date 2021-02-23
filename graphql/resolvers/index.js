import Event from '../../models/event'
import User from '../../models/user'
import Booking from '../../models/booking'
import bcrypt from 'bcryptjs'

const _userId = '60345738d142dd82f4400d5f'

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

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId)
    return {
      ...event._doc,
      date: event._doc.date.toLocaleString(),
      creator: user.bind(this, event.creator)
    }
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
  bookings: async () => {
    try {
      const bookings = await Booking.find()
      return bookings.map((booking) => {
        return {
          ...booking._doc,
          user: user.bind(this, booking.user._doc.user),
          event: singleEvent.bind(this, booking.event._doc.event),
          createdAt: new Date(booking._doc.createdAt).toLocaleString(),
          updatedAt: new Date(booking._doc.updatedAt).toLocaleString()
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
      creator: _userId
    })
    let createdEvent
    try {
      const result = await event.save()
      createdEvent = {
        ...result._doc,
        date: result._doc.date.toLocaleString(),
        creator: user.bind(this, result._doc.creator)
      }
      const creator = await User.findById(_userId)

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
      } //hiding the password
    } catch (err) {
      throw err
    }
  },
  bookEvent: async ({ eventId }) => {
    try {
      const fetchedEvent = await Event.findOne({ _id: eventId })
      const singleBooking = new Booking({
        user: _userId,
        event: fetchedEvent
      })
      const result = await singleBooking.save()
      return {
        ...result._doc,
        user: user.bind(this, result._doc.user),
        event: singleEvent.bind(this, result._doc.event),
        createdAt: new Date(result._doc.createdAt).toLocaleString(),
        updatedAt: new Date(result._doc.updatedAt).toLocaleString()
      }
    } catch (err) {
      throw err
    }
  },
  cancelBooking: async ({ bookingId }) => {
    try {
      const booking = await Booking.findById(bookingId).populate('event')
      if (booking == null) {
        throw new Error('Booking Does not Exist')
      }
      const event = {
        ...booking.event._doc,
        creator: user.bind(this, booking.event._doc.creator)
      }
      await Booking.deleteOne({ _id: bookingId })
      return event
    } catch (err) {
      throw err
    }
  }
}

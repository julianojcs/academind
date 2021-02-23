import Event from '../../models/event'
import User from '../../models/user'

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } })
    return events.map((event) => {
      return transformEvent(event)
    })
  } catch (err) {
    throw err
  }
}

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId)
    return transformEvent(event)
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

const transformEvent = (event) => {
  return {
    ...event._doc,
    date: event._doc.date.toLocaleString(),
    creator: user.bind(this, event.creator)
  }
}

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: booking._doc.createdAt.toLocaleString(),
    updatedAt: booking._doc.updatedAt.toLocaleString()
  }
}

module.exports = {
  transformEvent,
  transformBooking
}

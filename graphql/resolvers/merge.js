import Event from '../../models/event'
import User from '../../models/user'
import DataLoader from 'dataloader'

const eventLoader = new DataLoader((eventIds) => {
  return events(eventIds)
})

const userLoader = new DataLoader((userIds) => {
  console.log(userIds)
  return User.find({ _id: { $in: userIds } })
})

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
    // const event = await Event.findById(eventId)
    const event = await eventLoader.load(eventId.toString())
    // return transformEvent(event)
    return event
  } catch (err) {
    throw err
  }
}

const user = async (userId) => {
  try {
    // const user = await User.findById(userId)
    const user = await userLoader.load(userId.toString())
    // console.log(user._doc.createdEvents)
    return {
      ...user._doc,
      password: null,
      createdAt: user._doc.createdAt.toLocaleString(),
      // createdEvents: events.bind(this, user._doc.createdEvents)
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)  // not loading only one eventId, but many eventsId
    }
  } catch (err) {
    throw err
  }
}

const transformEvent = (event) => {
  return {
    ...event._doc,
    date: event._doc.date.toLocaleString(),
    creator: () => user(event.creator)
    // creator: userLoader.load.bind(this, event.creator)
  }
}

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    user: () => user(booking._doc.user),
    event: () => singleEvent(booking._doc.event),
    createdAt: booking._doc.createdAt.toLocaleString(),
    updatedAt: booking._doc.updatedAt.toLocaleString()
  }
}

module.exports = {
  transformEvent,
  transformBooking
}

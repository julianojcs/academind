import Event from '../../models/event'
import User from '../../models/user'
import { transformEvent } from './merge'

module.exports = {
  events: async () => {
    try {
      const events = await Event.find() // .populate('creator')
      return events.map((event) => {
        return transformEvent(event)
      })
    } catch (err) {
      throw err
    }
  },

  createEvent: async ({ eventInput }) => {
    const event = new Event({
      ...eventInput,
      creator: '60345738d142dd82f4400d5f'
    })
    let createdEvent
    try {
      const result = await event.save()
      createdEvent = transformEvent(result)
      const creator = await User.findById('60345738d142dd82f4400d5f')

      if (!creator) {
        throw new Error('User not found!')
      }
      creator.createdEvents.push(event)
      await creator.save()

      return createdEvent
    } catch (err) {
      throw err
    }
  }
}

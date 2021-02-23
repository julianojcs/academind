import Event from '../../models/event'
import Booking from '../../models/booking'
import { transformBooking, transformEvent } from './merge'

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find()
      return bookings.map((booking) => {
        return transformBooking(booking)
      })
    } catch (err) {
      throw err
    }
  },

  bookEvent: async ({ eventId }) => {
    try {
      const fetchedEvent = await Event.findOne({ _id: eventId })
      const singleBooking = new Booking({
        user: '60345738d142dd82f4400d5f',
        event: fetchedEvent
      })
      const result = await singleBooking.save()
      return transformBooking(result)
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
      const event = transformEvent(booking.event)
      await Booking.deleteOne({ _id: bookingId })
      return event
    } catch (err) {
      throw err
    }
  }
}

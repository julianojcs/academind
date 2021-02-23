import * as authResolver from './auth'
import * as eventResolver from './event'
import * as bookingResolver from './booking'

module.exports = {
  ...authResolver,
  ...eventResolver,
  ...bookingResolver
}
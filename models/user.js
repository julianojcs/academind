import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: { type: String, required: true, lowercase: true },
  password: { type: String, required: true },
  createdEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  createdAt: { type: Date, required: true, default: new Date() }
})

module.exports = mongoose.model('User', userSchema)

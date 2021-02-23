import User from '../../models/user'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

module.exports = {
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

  login: async ({email, password}) => {
    const user = await User.findOne({ email })
    if (!user) {
      throw new Error('User is incorrect!')
    }

    const isEqual = await bcrypt.compare(password, user.password)
    if (!isEqual) {
      throw new Error('Pasword is incorrect!')
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_KEY, { expiresIn: '1h'})

    return {
      userId: user.id,
      token,
      tokenExpiration: 1
    }
  }
}

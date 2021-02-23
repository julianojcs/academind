import User from '../../models/user'
import bcrypt from 'bcryptjs'

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
  }
}

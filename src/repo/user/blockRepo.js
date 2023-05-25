module.exports = container => {
  const { serverHelper } = container.resolve('config')
  const { schemas } = container.resolve('models')
  const { User } = schemas.mongoose
  const getUserInfo = async (uid) => {
    try {
      const user = await User.findOne({ uid }).lean()
      return user || {}
    } catch (e) {
      return {}
    }
  }

  const isKick = async (token) => {
    const user = serverHelper.decodeToken(token)
    const { uid } = user
    const userDB = User.findOne({ uid }).lean()
    return userDB.isLocked
  }

  return {
    getUserInfo,
    isKick
  }
}

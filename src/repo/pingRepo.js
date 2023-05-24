module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Ping } = schemas.mongoose
  const saveLastPing = (id, deviceType, loginType) => {
    return Ping.findOneAndUpdate({ uid: id }, {
      uid: id,
      lastPing: Math.floor(Date.now() / 1000)
    }, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  return { saveLastPing }
}

module.exports = container => {
  const { schemas } = container.resolve('models')
  const { SessionCMS } = schemas.mongoose
  const addSessionCMS = (hash, userId, expireAt) => {
    const sess = new SessionCMS({ hash, userId, expireAt })
    return sess.save()
  }
  const updateSessionCMS = (id, sess) => {
    return SessionCMS.findByIdAndUpdate(id, sess, { useFindAndModify: false })
  }
  const updateSessionCMSByCondition = (pipe, update) => {
    return SessionCMS.updateOne(pipe, { $set: update }, { upsert: true })
  }
  const removeSessionCMSById = id => {
    return SessionCMS.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const removeSessionCMS = (pipe) => {
    return SessionCMS.deleteMany(pipe)
  }
  const getSessionCMS = (pipe) => {
    return SessionCMS.find(pipe).sort({ _id: -1 })
  }
  return { addSessionCMS, removeSessionCMSById, updateSessionCMS, updateSessionCMSByCondition, removeSessionCMS, getSessionCMS }
}

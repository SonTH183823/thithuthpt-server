module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Notification } = schemas
  const createNotification = (data) => {
    const n = new Notification(data)
    return n.save()
  }
  const getNotificationById = (id) => {
    return Notification.findById(id)
  }
  const deleteNotification = (id) => {
    return Notification.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateNotification = (id, n) => {
    return Notification.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return Notification.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return Notification.countDocuments(pipe)
  }
  const getNotificationAgg = (pipe) => {
    return Notification.aggregate(pipe)
  }
  const getListNotification = (pipe, limit, skip, sort) => {
    return Notification.find(pipe).limit(limit).skip(skip).sort(sort).populate('userId userPushId')
  }
  const getNotificationNoPaging = (pipe) => {
    return Notification.find(pipe).populate('category tags')
  }
  const removeNotification = (pipe) => {
    return Notification.deleteMany(pipe)
  }
  const getNotification = async (id) => {
    return Notification.findOne(id)
  }
  const findOne = async (pipe) => {
    return Notification.findOne(pipe)
  }
  const findNotification = (pipe) => {
    return Notification.find(pipe)
  }
  const updateMany = (con, up) => {
    return Notification.updateMany(con, up)
  }
  const find = (con, up) => {
    return Notification.updateMany(con, up)
  }
  return {
    find,
    findOne,
    getNotificationNoPaging,
    removeNotification,
    createNotification,
    getNotificationAgg,
    getNotificationById,
    deleteNotification,
    updateNotification,
    checkIdExist,
    getCount,
    getNotification,
    getListNotification,
    updateMany,
    findNotification
  }
}

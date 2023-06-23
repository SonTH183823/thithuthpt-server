module.exports = (container) => {
  const logger = container.resolve('logger')
  const { httpCode, serverHelper } = container.resolve('config')
  const { notificationRepo } = container.resolve('repo')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemas: {
      Notification
    }
  } = container.resolve('models')
  const getNumberNotificationUnViewed = async (req, res) => {
    try {
      const { userId } = req.user
      const notifications = await notificationRepo.getCount({ userId: ObjectId(userId), isViewed: 0 })
      if (notifications) {
        return res.status(httpCode.SUCCESS).json({ total: notifications })
      }
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    } catch (e) {
      logger.e(e)
      if (e.code === 11000) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'Tiêu đề đã tồn tại!' })
      }
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const getNotificationUnViewed = async (req, res) => {
    try {
      const { userId } = req.user
      let {
        page,
        perPage,
        sort
      } = req.query
      page = +page || 1
      perPage = +perPage || 10
      sort = +sort === 0 ? { createdAt: 1 } : +sort || { createdAt: -1 }
      const skip = (page - 1) * perPage
      const search = { ...req.query }
      const pipe = {}
      delete search.page
      delete search.perPage
      delete search.sort

      Object.keys(search).forEach(key => {
        const value = search[key]
        const pathType = (Notification.schema.path(key) || {}).instance || ''
        if (pathType.toLowerCase() === 'objectid') {
          pipe[key] = value ? ObjectId(value) : { $exists: false }
        } else if (pathType === 'Number') {
          pipe[key] = +value ? +value : 0
        } else if (pathType === 'String' && value.constructor === String) {
          pipe[key] = serverHelper.formatRegex(value)
        } else {
          pipe[key] = value
        }
      })
      pipe.userId = ObjectId(userId)
      pipe.isViewed = 0
      const data = await notificationRepo.getListNotification(pipe, perPage, skip, sort)
      const total = await notificationRepo.getCount(pipe)
      return res.status(httpCode.SUCCESS).json({
        data,
        page,
        perPage,
        sort,
        total
      })
    } catch (e) {
      logger.e(e)
      if (e.code === 11000) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'Tiêu đề đã tồn tại!' })
      }
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const markNotificationRead = async (req, res) => {
    try {
      const { userId } = req.user
      const { id } = req.params
      if (id && id.length === 24 && userId) {
        await notificationRepo.updateNotification(id, { isRead: 1 })
        return res.status(httpCode.SUCCESS).json({ ok: true })
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      if (e.code === 11000) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'Tiêu đề đã tồn tại!' })
      }
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const markAllNotificationViewed = async (req, res) => {
    try {
      const { userId } = req.user
      await notificationRepo.updateNotification({ userId: ObjectId(userId) }, { isViewed: 0 })
      return res.status(httpCode.SUCCESS).json({ ok: true })
    } catch (e) {
      logger.e(e)
      if (e.code === 11000) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'Tiêu đề đã tồn tại!' })
      }
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  return {
    getNumberNotificationUnViewed,
    getNotificationUnViewed,
    markNotificationRead,
    markAllNotificationViewed
  }
}

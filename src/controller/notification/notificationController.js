module.exports = (container) => {
  const logger = container.resolve('logger')
  const { httpCode, serverHelper } = container.resolve('config')
  const { notificationRepo } = container.resolve('repo')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator,
    schemas: {
      Notification
    }
  } = container.resolve('models')

  const getListNotification = async (req, res) => {
    try {
      let {
        page,
        perPage,
        sort,
        ids,
        startTime,
        endTime,
        title
      } = req.query
      page = +page || 1
      perPage = +perPage || 10
      sort = +sort === 0 ? { createdAt: 1 } : +sort || { createdAt: -1 }
      const skip = (page - 1) * perPage
      const search = { ...req.query }
      if (search.slug) {
        search.slug = serverHelper.stringToSlug(search.slug)
      }
      const pipe = {}
      if (title) {
        pipe.slug = new RegExp(serverHelper.stringToSlug(title).replace(/\\/g, '\\\\'), 'gi')
      }
      if (ids) {
        if (ids.constructor === Array) {
          pipe._id = { $in: ids }
        } else if (ids.constructor === String) {
          pipe._id = { $in: ids.split(',') }
        }
      }
      if (startTime) {
        pipe.createdAt = { $gte: startTime }
      }
      if (endTime) {
        pipe.createdAt = { ...pipe.createdAt, $lte: endTime }
      }
      delete search.ids
      delete search.page
      delete search.perPage
      delete search.sort
      delete search.startTime
      delete search.endTime
      delete search.title

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
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const getNotificationById = async (req, res) => {
    try {
      let { id } = req.params
      id = decodeURI(id)
      const query = { $or: [{ slug: id }] }
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        query.$or.push({ _id: id })
      }
      const notification = await notificationRepo.getNotification(query)
      if (notification) {
        return res.status(httpCode.SUCCESS).json(notification)
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const removeNotificationById = async (req, res) => {
    try {
      const { id } = req.params
      if (id && id.length === 24) {
        await notificationRepo.deleteNotification(id)
        return res.status(httpCode.SUCCESS).json({ ok: true })
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const updateNotificationById = async (req, res) => {
    try {
      const { id } = req.params
      const body = req.body
      if (id && id.length === 24) {
        const item = await notificationRepo.getNotificationById(id)
        if (item) {
          body.slug = serverHelper.stringToSlug(body.title)
          body.keyword = serverHelper.stringToSlugSearch(body.title)
          body.updatedAt = Math.floor(Date.now() / 1000)
          const {
            error,
            value
          } = await schemaValidator(body, 'Notification')
          if (error) {
            logger.e(error)
            return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
          }
          const {
            title,
            thumbnail,
            slug,
            content,
            category,
            tags,
            active,
            keyword
          } = item.toObject()
          const oldObject = {
            title,
            thumbnail,
            slug,
            content,
            category: category ? category.toString : '',
            tags,
            active,
            keyword
          }
          const newObject = {
            title: value.title,
            thumbnail: value.thumbnail,
            slug: value.slug,
            content: value.content,
            category: value.category,
            tags: value.tags,
            active: value.active,
            keyword: value.keyword
          }
          if (serverHelper.deepCompare(oldObject, newObject)) {
            return res.status(httpCode.BAD_REQUEST).json({ msg: 'Dữ liệu không thay đổi!' })
          }
          await notificationRepo.updateNotification(id, value)
          return res.status(httpCode.SUCCESS).json({ ok: true })
        }
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
  const createNotification = async (req, res) => {
    try {
      const { userId } = req.user
      const body = req.body
      if (body) {
        body.userId = userId
        body.updatedAt = Math.floor(Date.now() / 1000)
        const {
          error,
          value
        } = await schemaValidator(body, 'Notification')
        if (error) {
          logger.e(error)
          return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
        }
        const notification = await notificationRepo.createNotification(value)
        return res.status(httpCode.CREATED).json(notification)
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
  const getNumberNotificationUnViewed = async (req, res) => {
    try {
      const { userId } = req.user
      const notifications = await notificationRepo.getCount({ userId: ObjectId(userId), isViewed: 0 })
      return res.status(httpCode.SUCCESS).json({ total: notifications })
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
    getListNotification,
    getNotificationById,
    removeNotificationById,
    updateNotificationById,
    createNotification,
    getNumberNotificationUnViewed,
    getNotificationUnViewed,
    markNotificationRead,
    markAllNotificationViewed
  }
}

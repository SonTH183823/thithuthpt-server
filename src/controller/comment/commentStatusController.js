module.exports = (container) => {
  const logger = container.resolve('logger')
  const { httpCode, serverHelper } = container.resolve('config')
  const { commentStatusRepo, userRepo, notificationRepo } = container.resolve('repo')
  const { handlePushFCM } = container.resolve('notification')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator, schemas: {
      CommentStatus
    }
  } = container.resolve('models')

  const getCommentStatusById = async (req, res) => {
    try {
      const { id } = req.params
      if (id && id.length === 24) {
        const item = await commentStatusRepo.getCommentStatusById(id)
        if (item) {
          return res.status(httpCode.SUCCESS).json(item)
        }
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const getCommentStatusByListCommentIdAndUser = async (req, res) => {
    try {
      const { commentId } = req.query
      const { userId } = req.user
      const ids = commentId.split(',').map(va => ObjectId(va))
      const data = await commentStatusRepo.getCommentStatusNoPaging({
        userId: ObjectId(userId),
        commentId: { $in: ids }
      })
      return res.status(httpCode.SUCCESS).json(data)
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const removeCommentStatusById = async (req, res) => {
    try {
      const { id } = req.params
      if (id && id.length === 24) {
        await commentStatusRepo.deleteCommentStatus(id)
        return res.status(httpCode.SUCCESS).json({})
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const updateCommentStatusById = async (req, res) => {
    try {
      const { id } = req.params
      const data = req.body
      if (id && id.length === 24) {
        const item = await commentStatusRepo.getCommentStatusById(id)
        if (item) {
          const {
            error, value
          } = await schemaValidator(data, 'CommentStatus')
          if (error) {
            logger.e(error)
            return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
          }
          await commentStatusRepo.updateCommentStatus(id, value)
          return res.status(httpCode.SUCCESS).json({ ok: true })
        }
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const createCommentStatus = async (req, res) => {
    try {
      const { commentId, userId, status, userCmtId, title, postId, typePost } = req.body
      const data = { commentId, userId, status }
      if (data) {
        const {
          error, value
        } = await schemaValidator(data, 'CommentStatus')
        if (error) {
          logger.e(error)
          return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
        }
        const rate = await commentStatusRepo.createCommentStatus(value)
        if (userCmtId !== userId) {
          const userComment = await userRepo.getUserById(ObjectId(userCmtId))
          const userReact = await userRepo.getUserById(ObjectId(userId))
          const {
            notiData,
            messages
          } = serverHelper.genDataReact(userComment, userReact, status, title, postId, typePost)
          const {
            error, value
          } = await schemaValidator(notiData, 'Notification')
          if (error) {
            logger.e(error)
            return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
          }
          await notificationRepo.createNotification(value)
          if (messages.token) {
            await handlePushFCM(messages)
          }
        }
        return res.status(httpCode.CREATED).json(rate)
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      if (e.code === 11000) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'Mã rate đã tồn tại' })
      }
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const getListCommentStatus = async (req, res) => {
    try {
      let {
        page, perPage, sort
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
        const pathType = (CommentStatus.schema.path(key) || {}).instance || ''
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
      const data = await commentStatusRepo.getListCommentStatus(pipe, perPage, skip, sort)
      const total = await commentStatusRepo.getCount(pipe)
      return res.status(httpCode.SUCCESS).json({
        data, page, perPage, sort, total, ok: true
      })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }

  const delCommentStatusNotId = async (req, res) => {
    try {
      const { commentId, userId } = req.query
      const hasOne = await commentStatusRepo.findOne({ userId, commentId })
      if (hasOne) {
        await commentStatusRepo.removeCommentStatusById(hasOne._id)
        return res.status(httpCode.SUCCESS).json({ ok: true })
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  return {
    getCommentStatusById,
    removeCommentStatusById,
    updateCommentStatusById,
    createCommentStatus,
    getListCommentStatus,
    getCommentStatusByListCommentIdAndUser,
    delCommentStatusNotId
  }
}

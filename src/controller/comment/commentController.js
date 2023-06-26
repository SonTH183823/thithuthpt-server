module.exports = (container) => {
  const logger = container.resolve('logger')
  const { handlePushFCM } = container.resolve('notification')
  const { httpCode, serverHelper } = container.resolve('config')
  const { commentRepo, userRepo, notificationRepo } = container.resolve('repo')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator, schemas: {
      Comment
    }
  } = container.resolve('models')

  const getCommentById = async (req, res) => {
    try {
      const { id } = req.params
      if (id && id.length === 24) {
        const item = await commentRepo.getCommentById(id)
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
  const removeCommentById = async (req, res) => {
    try {
      const { id } = req.params
      if (id && id.length === 24) {
        await commentRepo.deleteComment(id)
        return res.status(httpCode.SUCCESS).json({ ok: true })
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const updateCommentById = async (req, res) => {
    try {
      const { id } = req.params
      const data = req.body
      if (id && id.length === 24) {
        const item = await commentRepo.getCommentById(id)
        if (item) {
          const {
            error, value
          } = await schemaValidator(data, 'Comment')
          if (error) {
            logger.e(error)
            return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
          }
          await commentRepo.updateComment(id, value)
          return res.status(httpCode.SUCCESS).json({ ok: true })
        }
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }

  const updateReactCommentById = async (req, res) => {
    try {
      const { id } = req.params
      const { like, dislike } = req.body
      if (id && id.length === 24) {
        const item = await commentRepo.getCommentById(id)
        const data = item.toObject()
        data.like = like
        data.dislike = dislike
        data.postId = data.postId.toString()
        data.userId = data.userId.toString()
        if (item) {
          const {
            error, value
          } = await schemaValidator(data, 'Comment')
          if (error) {
            logger.e(error)
            return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
          }
          await commentRepo.updateComment(id, value)
          return res.status(httpCode.SUCCESS).json({ ok: true })
        }
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const createComment = async (req, res) => {
    try {
      const { postId, userId, content, imageAttach, videoAttach, typePost, title } = req.body
      const data = { postId, userId, content, imageAttach, videoAttach }
      const userComment = req.user
      if (data) {
        const {
          error, value
        } = await schemaValidator(data, 'Comment')
        if (error) {
          logger.e(error)
          return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
        }
        const rate = await commentRepo.createComment(value)
        const ids = await commentRepo.getAllUserId([
          { $match: { postId: ObjectId(postId) } },
          { $group: { _id: '$userId' } }
        ])
        const listUser = await userRepo.getUserNoPaging({ _id: { $in: ids } }).lean()
        for (const user of listUser) {
          const x = user._id.toString()
          if (user && x !== userId) {
            const { notiData, messages } = serverHelper.genDataNotification(typePost, user, title, postId, userComment)
            notiData.userId = user._id.toString()
            notiData.userPushId = userId
            const {
              error, value
            } = await schemaValidator(notiData, 'Notification')
            if (error) {
              logger.e(error)
              return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
            }
            await notificationRepo.createNotification(value)
            if (user.fcmToken) {
              await handlePushFCM(messages)
            }
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
  const getListComment = async (req, res) => {
    try {
      const { id } = req.params
      let {
        page, perPage, sort
      } = req.query
      page = +page || 1
      perPage = +perPage || 10
      sort = +sort === 0 ? { createdAt: 1 } : +sort || { createdAt: -1 }
      const skip = (page - 1) * perPage
      const search = { ...req.query }
      const pipe = {}
      pipe.postId = id
      delete search.page
      delete search.perPage
      delete search.sort

      Object.keys(search).forEach(key => {
        const value = search[key]
        const pathType = (Comment.schema.path(key) || {}).instance || ''
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
      const data = await commentRepo.getComment(pipe, perPage, skip, sort)
      const total = await commentRepo.getCount(pipe)
      return res.status(httpCode.SUCCESS).json({
        data, page, perPage, sort, total
      })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  return {
    getCommentById,
    removeCommentById,
    updateCommentById,
    createComment,
    getListComment,
    updateReactCommentById
  }
}

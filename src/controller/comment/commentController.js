module.exports = (container) => {
  const logger = container.resolve('logger')
  const { httpCode } = container.resolve('config')
  const { commentRepo, serverHelper } = container.resolve('repo')
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
  const createComment = async (req, res) => {
    try {
      const data = req.body
      if (data) {
        const {
          error, value
        } = await schemaValidator(data, 'Comment')
        if (error) {
          logger.e(error)
          return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
        }
        const rate = await commentRepo.createComment(value)
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
    getCommentById, removeCommentById, updateCommentById, createComment, getListComment
  }
}

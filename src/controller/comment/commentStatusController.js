module.exports = (container) => {
  const logger = container.resolve('logger')
  const { httpCode } = container.resolve('config')
  const { commentStatusRepo, serverHelper } = container.resolve('repo')
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
      const data = req.body
      if (data) {
        const {
          error, value
        } = await schemaValidator(data, 'CommentStatus')
        if (error) {
          logger.e(error)
          return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
        }
        const rate = await commentStatusRepo.createCommentStatus(value)
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
  const toggleComentStatus = async (req, res) => {
    try {
      const { userId, examId } = req.body
      if (userId && examId) {
        const data = await commentStatusRepo.findOne({ userId, examId })
        if (!data) {
          const {
            error, value
          } = await schemaValidator({ userId, examId }, 'CommentStatus')
          if (error) {
            logger.e(error)
            return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
          }
          const rate = await commentStatusRepo.createCommentStatus(value)
          return res.status(httpCode.CREATED).json({ ...rate, ok: true })
        } else {
          await commentStatusRepo.deleteCommentStatus(data._id)
          return res.status(httpCode.SUCCESS).json({ ok: true })
        }
      } else {
        return res.sendStatus(httpCode.BAD_REQUEST)
      }
    } catch (e) {
      console.log(e)
      return res.sendStatus(httpCode.UNKNOWN_ERROR)
    }
  }
  return {
    getCommentStatusById,
    removeCommentStatusById,
    updateCommentStatusById,
    createCommentStatus,
    getListCommentStatus,
    toggleComentStatus
  }
}

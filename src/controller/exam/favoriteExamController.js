module.exports = (container) => {
  const logger = container.resolve('logger')
  const { httpCode } = container.resolve('config')
  const { favoriteExamRepo, serverHelper } = container.resolve('repo')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator, schemas: {
      FavoriteExam
    }
  } = container.resolve('models')

  const getFavoriteExamById = async (req, res) => {
    try {
      const { id } = req.params
      if (id && id.length === 24) {
        const item = await favoriteExamRepo.getFavoriteExamById(id)
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
  const removeFavoriteExamById = async (req, res) => {
    try {
      const { id } = req.params
      if (id && id.length === 24) {
        await favoriteExamRepo.deleteFavoriteExam(id)
        return res.status(httpCode.SUCCESS).json({})
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const updateFavoriteExamById = async (req, res) => {
    try {
      const { id } = req.params
      const data = req.body
      if (id && id.length === 24) {
        const item = await favoriteExamRepo.getFavoriteExamById(id)
        if (item) {
          const {
            error, value
          } = await schemaValidator(data, 'FavoriteExam')
          if (error) {
            logger.e(error)
            return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
          }
          await favoriteExamRepo.updateFavoriteExam(id, value)
          return res.status(httpCode.SUCCESS).json({ ok: true })
        }
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const createFavoriteExam = async (req, res) => {
    try {
      const data = req.body
      if (data) {
        const {
          error, value
        } = await schemaValidator(data, 'FavoriteExam')
        if (error) {
          logger.e(error)
          return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
        }
        const rate = await favoriteExamRepo.createFavoriteExam(value)
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
  const getListFavoriteExams = async (req, res) => {
    try {
      let {
        page, perPage, sort, ids
      } = req.query
      page = +page || 1
      perPage = +perPage || 10
      sort = +sort === 0 ? { createdAt: 1 } : +sort || { createdAt: -1 }
      const skip = (page - 1) * perPage
      const search = { ...req.query }
      const pipe = {}

      if (ids) {
        if (ids.constructor === Array) {
          pipe._id = { $in: ids }
        } else if (ids.constructor === String) {
          pipe._id = { $in: ids.split(',') }
        }
      }
      delete search.ids
      delete search.page
      delete search.perPage
      delete search.sort

      Object.keys(search).forEach(key => {
        const value = search[key]
        const pathType = (FavoriteExam.schema.path(key) || {}).instance || ''
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
      const data = await favoriteExamRepo.getListFavoriteExam(pipe, perPage, skip, sort)
      const total = await favoriteExamRepo.getCount(pipe)
      return res.status(httpCode.SUCCESS).json({
        data, page, perPage, sort, total, ok: true
      })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const toggleFavorite = async (req, res) => {
    try {
      const { userId, examId } = req.body
      if (userId && examId) {
        const data = await favoriteExamRepo.findOne({ userId, examId })
        if (!data) {
          const {
            error, value
          } = await schemaValidator({ userId, examId }, 'FavoriteExam')
          if (error) {
            logger.e(error)
            return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
          }
          const rate = await favoriteExamRepo.createFavoriteExam(value)
          return res.status(httpCode.CREATED).json({ ...rate, ok: true })
        } else {
          await favoriteExamRepo.deleteFavoriteExam(data._id)
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
    getFavoriteExamById,
    removeFavoriteExamById,
    updateFavoriteExamById,
    createFavoriteExam,
    getListFavoriteExams,
    toggleFavorite
  }
}

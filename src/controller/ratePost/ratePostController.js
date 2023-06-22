module.exports = (container) => {
  const logger = container.resolve('logger')
  const { httpCode } = container.resolve('config')
  const { ratePostRepo, serverHelper } = container.resolve('repo')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator, schemas: {
      RatePost
    }
  } = container.resolve('models')

  const getRatePostById = async (req, res) => {
    try {
      const { userId } = req.user
      const { id: postId } = req.params
      if (userId && userId.length === 24 && postId && postId.length === 24) {
        const item = await ratePostRepo.getRateByPostAndUser({ userId: ObjectId(userId), postId: ObjectId(postId) })
        return res.status(httpCode.SUCCESS).json(item)
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const removeRatePostById = async (req, res) => {
    try {
      const { id } = req.params
      if (id && id.length === 24) {
        await ratePostRepo.deleteRatePost(id)
        return res.status(httpCode.SUCCESS).json({ ok: true })
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const updateRatePostById = async (req, res) => {
    try {
      const { id } = req.params
      const data = req.body
      if (id && id.length === 24) {
        const item = await ratePostRepo.getRatePostById(id)
        if (item) {
          const {
            error, value
          } = await schemaValidator(data, 'RatePost')
          if (error) {
            logger.e(error)
            return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
          }
          await ratePostRepo.updateRatePost(id, value)
          return res.status(httpCode.SUCCESS).json({ ok: true })
        }
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }

  const updateReactRatePostById = async (req, res) => {
    try {
      const { id } = req.params
      const { like, dislike } = req.body
      if (id && id.length === 24) {
        const item = await ratePostRepo.getRatePostById(id)
        const data = item.toObject()
        data.like = like
        data.dislike = dislike
        data.postId = data.postId.toString()
        data.userId = data.userId.toString()
        if (item) {
          const {
            error, value
          } = await schemaValidator(data, 'RatePost')
          if (error) {
            logger.e(error)
            return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
          }
          await ratePostRepo.updateRatePost(id, value)
          return res.status(httpCode.SUCCESS).json({ ok: true })
        }
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const createRatePost = async (req, res) => {
    try {
      const data = req.body
      if (data) {
        const {
          error, value
        } = await schemaValidator(data, 'RatePost')
        if (error) {
          logger.e(error)
          return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
        }
        const rate = await ratePostRepo.createRatePost(value)
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
  const getListRatePost = async (req, res) => {
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
        const pathType = (RatePost.schema.path(key) || {}).instance || ''
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
      const data = await ratePostRepo.getRatePost(pipe, perPage, skip, sort)
      const total = await ratePostRepo.getCount(pipe)
      return res.status(httpCode.SUCCESS).json({
        data, page, perPage, sort, total
      })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  return {
    getRatePostById,
    removeRatePostById,
    updateRatePostById,
    createRatePost,
    getListRatePost,
    updateReactRatePostById
  }
}

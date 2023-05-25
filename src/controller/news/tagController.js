module.exports = (container) => {
  const logger = container.resolve('logger')
  const { httpCode, serverHelper } = container.resolve('config')
  const { tagRepo, newsRepo } = container.resolve('repo')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator,
    schemas: {
      Tag
    }
  } = container.resolve('models')

  const getListTagNews = async (req, res) => {
    try {
      let {
        page,
        perPage,
        sort,
        ids
      } = req.query
      page = +page || 1
      perPage = +perPage || 10
      sort = +sort === 0 ? { createdAt: 1 } : +sort || { createdAt: -1 }
      const skip = (page - 1) * perPage
      const search = { ...req.query }

      if (ids) {
        if (ids.constructor === Array) {
          search._id = { $in: ids }
        } else if (ids.constructor === String) {
          search._id = { $in: ids.split(',') }
        }
      }
      delete search.ids
      delete search.page
      delete search.perPage
      delete search.sort

      const pipe = {}
      Object.keys(search).forEach(key => {
        const value = search[key]
        const pathType = (Tag.schema.path(key) || {}).instance || ''
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
      const data = await tagRepo.getTag(pipe, perPage, skip, sort)
      const total = await tagRepo.getCount(pipe)
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
  const getTagNewsById = async (req, res) => {
    try {
      const { id } = req.params
      if (id && id.length === 24) {
        const item = await tagRepo.getTagNewsById(id)
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
  const removeTagById = async (req, res) => {
    try {
      const { id } = req.params
      if (id && id.length === 24) {
        const old = await newsRepo.findOne({ tags: { $in: [ObjectId(id)] } })
        if (old) {
          return res.status(httpCode.BAD_REQUEST).json({ msg: 'Tag nay da duoc su dung' })
        }
        await tagRepo.deleteTag(id)
        return res.status(httpCode.SUCCESS).json({})
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const updateTagById = async (req, res) => {
    try {
      const { id } = req.params
      const data = req.body
      if (id && id.length === 24) {
        const item = await tagRepo.getTagNewsById(id)
        if (item) {
          data.slug = serverHelper.stringToSlug(data.name)
          const {
            error,
            value
          } = await schemaValidator(data, 'Tag')
          if (error) {
            logger.e(error)
            return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
          }
          await tagRepo.updateTag(id, value)
          return res.status(httpCode.SUCCESS).json({ ok: true })
        }
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      if (e.code === 11000) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'Tags đã tồn tại' })
      }
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const createTag = async (req, res) => {
    try {
      const { _id } = req.user
      let data = req.body
      if (data) {
        data = { ...data, createdBy: _id.toString() }
        data.slug = serverHelper.stringToSlug(data.name)
        const {
          error,
          value
        } = await schemaValidator(data, 'Tag')
        if (error) {
          logger.e(error)
          return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
        }
        const tags = await tagRepo.createTag(value)
        return res.status(httpCode.CREATED).json(tags)
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      if (e.code === 11000) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'Tags đã tồn tại' })
      }
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const getListTagNewsByCMS = async (req, res) => {
    try {
      let {
        page,
        perPage,
        sort,
        ids
      } = req.query
      page = +page || 1
      perPage = +perPage || 10
      sort = +sort === 0 ? { createdAt: 1 } : +sort || { createdAt: -1 }
      const skip = (page - 1) * perPage
      const search = { ...req.query }

      if (ids) {
        if (ids.constructor === Array) {
          search._id = { $in: ids }
        } else if (ids.constructor === String) {
          search._id = { $in: ids.split(',') }
        }
      }
      delete search.ids
      delete search.page
      delete search.perPage
      delete search.sort
      const pipe = {}

      Object.keys(search).forEach(key => {
        const value = search[key]
        const pathType = (Tag.schema.path(key) || {}).instance || ''
        if (pathType.toLowerCase() === 'objectid') {
          pipe[key] = ObjectId(value)
        } else if (pathType === 'Number') {
          pipe[key] = +value
        } else if (pathType === 'String' && value.constructor === String) {
          pipe[key] = serverHelper.formatRegex(value)
        } else {
          pipe[key] = value
        }
      })
      pipe.delete = 0
      const data = await tagRepo.getTag(pipe, perPage, skip, sort)
      const total = await tagRepo.getCount(pipe)
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
  return Object.create({
    getListTagNews,
    getTagNewsById,
    removeTagById,
    updateTagById,
    createTag,
    getListTagNewsByCMS
  })
}

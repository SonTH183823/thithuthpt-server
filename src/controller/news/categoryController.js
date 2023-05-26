module.exports = (container) => {
  const logger = container.resolve('logger')
  const { httpCode, serverHelper } = container.resolve('config')
  const { categoryRepo, newsRepo } = container.resolve('repo')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator,
    schemas: {
      Category
    }
  } = container.resolve('models')

  const getListCateNews = async (req, res) => {
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
      if (search.slug) {
        search.slug = serverHelper.stringToSlug(search.slug)
      }
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
        const pathType = (Category.schema.path(key) || {}).instance || ''
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
      const data = await categoryRepo.getCategory(pipe, perPage, skip, sort)
      const total = await categoryRepo.getCount(pipe)
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
  const getCateNewsById = async (req, res) => {
    try {
      const { id } = req.params
      if (id && id.length === 24) {
        const item = await categoryRepo.getCategoryById(id)
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
  const removeCateNewsById = async (req, res) => {
    try {
      const { id } = req.params
      if (id && id.length === 24) {
        const old = await newsRepo.findOne({ category: ObjectId(id) })
        if (old) {
          return res.status(httpCode.BAD_REQUEST).json({ msg: 'Danh muc nay da duoc su dung' })
        }
        await categoryRepo.deleteCategory(id)
        await newsRepo.updateMany({ category: ObjectId(id) }, { $unset: { category: '' } })
        return res.status(httpCode.SUCCESS).json({})
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const updateCateNewsById = async (req, res) => {
    try {
      const { id } = req.params
      const data = req.body
      if (id && id.length === 24) {
        const item = await categoryRepo.getCategoryById(id)
        if (item) {
          data.slug = serverHelper.stringToSlug(data.name)
          const {
            error,
            value
          } = await schemaValidator(data, 'Category')
          if (error) {
            logger.e(error)
            return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
          }
          await categoryRepo.updateCategory(id, value)
          return res.status(httpCode.SUCCESS).json({ ok: true })
        }
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      if (e.code === 11000) {
        return res.status(httpCode.BAD_REQUEST).json({ error: 'Loại tin đã tồn tại' })
      }
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const createCateNews = async (req, res) => {
    try {
      const { _id } = req.userCMS
      let data = req.body
      if (data) {
        data = { ...data, createdBy: _id.toString() }
        data.slug = serverHelper.stringToSlug(data.name)
        const {
          error,
          value
        } = await schemaValidator(data, 'Category')
        if (error) {
          logger.e(error)
          return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
        }
        const category = await categoryRepo.createCategory(value)
        return res.status(httpCode.CREATED).json(category)
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      if (e.code === 11000) {
        return res.status(httpCode.BAD_REQUEST).json({ error: 'Loại tin đã tồn tại' })
      }
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  return {
    getListCateNews,
    getCateNewsById,
    removeCateNewsById,
    updateCateNewsById,
    createCateNews
  }
}

module.exports = (container) => {
  const logger = container.resolve('logger')
  const { httpCode, serverHelper } = container.resolve('config')
  const { documentRepo } = container.resolve('repo')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator,
    schemas: {
      Document
    }
  } = container.resolve('models')

  const getListDocument = async (req, res) => {
    try {
      let {
        page,
        perPage,
        sort,
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
      let pipe = {}
      if (title) {
        pipe.slug = new RegExp(serverHelper.stringToSlug(title).replace(/\\/g, '\\\\'), 'gi')
      }

      delete search.page
      delete search.perPage
      delete search.sort
      delete search.title

      Object.keys(search).forEach(key => {
        const value = search[key]
        const pathType = (Document.schema.path(key) || {}).instance || ''
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
      const data = await documentRepo.getListDocument(pipe, perPage, skip, sort)
      const total = await documentRepo.getCount(pipe)
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
  const getDocumentRelated = async (req, res) => {
    try {
      let { id } = req.params
      let { subject, perPage } = req.query
      perPage = +perPage || 5
      id = decodeURI(id)
      const query = { _id: { $ne: id }, subject }
      const news = await documentRepo.getDocumentNoPaging(query, perPage)
      if (news) {
        return res.status(httpCode.SUCCESS).json(news)
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const getNewestDocument = async (req, res) => {
    try {
      const news = await documentRepo.getDocumentNoPaging()
      if (news) {
        return res.status(httpCode.SUCCESS).json(news)
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const getDocumentById = async (req, res) => {
    try {
      let { id } = req.params
      id = decodeURI(id)
      const query = { $or: [{ slug: id }] }
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        query.$or.push({ _id: id })
      }
      const news = await documentRepo.getDocument(query)
      if (news) {
        return res.status(httpCode.SUCCESS).json(news)
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const removeDocumentById = async (req, res) => {
    try {
      const { id } = req.params
      if (id && id.length === 24) {
        await documentRepo.deleteDocument(id)
        return res.status(httpCode.SUCCESS).json({ ok: true })
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const updateDocumentById = async (req, res) => {
    try {
      const { id } = req.params
      const body = req.body
      if (id && id.length === 24) {
        const item = await documentRepo.getDocumentById(id)
        if (item) {
          body.slug = serverHelper.stringToSlug(body.title)
          body.keyword = serverHelper.stringToSlugSearch(body.title)
          body.updatedAt = Math.floor(Date.now() / 1000)
          const {
            error,
            value
          } = await schemaValidator(body, 'Document')
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
            keyword,
            listTypeQuestion
          } = item.toObject()
          const oldObject = {
            title,
            thumbnail,
            slug,
            content,
            category: category ? category.toString : '',
            tags,
            active,
            keyword,
            listTypeQuestion
          }
          const newObject = {
            title: value.title,
            thumbnail: value.thumbnail,
            slug: value.slug,
            content: value.content,
            category: value.category,
            tags: value.tags,
            active: value.active,
            keyword: value.keyword,
            listTypeQuestion: value.listTypeQuestion,
          }
          if (serverHelper.deepCompare(oldObject, newObject)) {
            return res.status(httpCode.BAD_REQUEST).json({ msg: 'Dữ liệu không thay đổi!' })
          }
          await documentRepo.updateDocument(id, value)
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
  const updateViewTestDoc = async (req, res) => {
    try {
      const { id } = req.params
      if (id && id.length === 24) {
        const item = await documentRepo.getDocumentById(id)
        if (item) {
          const dt = { ...item.toObject() }
          dt.numberView += 1
          await documentRepo.updateDocument(id, dt)
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
  const createDocument = async (req, res) => {
    try {
      const { username } = req.userCMS
      const body = req.body
      if (body) {
        body.createdBy = username.toString()
        body.slug = serverHelper.stringToSlug(body.title)
        body.keyword = serverHelper.stringToSlugSearch(body.title)
        body.updatedAt = Math.floor(Date.now() / 1000)
        const {
          error,
          value
        } = await schemaValidator(body, 'Document')
        if (error) {
          logger.e(error)
          return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
        }
        const news = await documentRepo.createDocument(value)
        return res.status(httpCode.CREATED).json(news)
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
  return {
    getListDocument,
    getDocumentById,
    removeDocumentById,
    updateDocumentById,
    updateViewTestDoc,
    createDocument,
    getDocumentRelated,
    getNewestDocument
  }
}

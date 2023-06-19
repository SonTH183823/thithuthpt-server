module.exports = (container) => {
  const logger = container.resolve('logger')
  const { httpCode, serverHelper } = container.resolve('config')
  const { examRepo, questionRepo } = container.resolve('repo')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator,
    schemas: {
      Exam
    }
  } = container.resolve('models')

  const getListExam = async (req, res) => {
    try {
      let {
        page,
        perPage,
        sort,
        ids,
        startTime,
        endTime,
        title,
        rate,
        maxques,
        time
      } = req.query
      page = +page || 1
      perPage = +perPage || 10
      sort = +sort === 0 ? { createdAt: 1 } : +sort || { createdAt: -1 }
      const search = { ...req.query }
      if (search.slug) {
        search.slug = serverHelper.stringToSlug(search.slug)
      }
      let pipe = {}
      if (maxques) {
        pipe = {
          $expr: {
            $lte: [
              {
                $size: '$questionIds'
              },
              +maxques
            ]
          }
        }
      }
      if (rate) {
        pipe.rate = { $lte: +rate, $gte: +rate - 0.5 }
      }
      if (time) {
        pipe.time = { $lte: +time }
      }
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
      delete search.rate
      delete search.time
      delete search.maxques

      Object.keys(search).forEach(key => {
        const value = search[key]
        const pathType = (Exam.schema.path(key) || {}).instance || ''
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
      pipe.subject = { $lte: 8 }
      const data = await examRepo.getListExam(pipe)
      const total = await examRepo.getCount(pipe)
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
  const getListToeic = async (req, res) => {
    try {
      let {
        page,
        perPage,
        sort,
        ids,
        startTime,
        endTime,
        title,
        rate,
        time
      } = req.query
      page = +page || 1
      perPage = +perPage || 10
      sort = +sort === 0 ? { createdAt: 1 } : +sort || { createdAt: -1 }
      const search = { ...req.query }
      if (search.slug) {
        search.slug = serverHelper.stringToSlug(search.slug)
      }
      const pipe = {}
      pipe.subject = { $eq: 9 }
      if (rate) {
        pipe.rate = { $lte: +rate, $gte: +rate - 0.5 }
      }
      if (time) {
        pipe.time = { $lte: +time }
      }
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
      delete search.rate
      delete search.time

      Object.keys(search).forEach(key => {
        const value = search[key]
        const pathType = (Exam.schema.path(key) || {}).instance || ''
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
      const data = await examRepo.getListExam(pipe)
      const total = await examRepo.getCount(pipe)
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
  const getListQuestionExam = async (req, res) => {
    try {
      let { id } = req.params
      id = decodeURI(id)
      const query = { $or: [{ slug: id }] }
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        query.$or.push({ _id: id })
      }
      const news = await examRepo.getListQuestionExam(query)
      if (news) {
        return res.status(httpCode.SUCCESS).json(news)
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const getExamRelated = async (req, res) => {
    try {
      let { id } = req.params
      const { subject } = req.query
      id = decodeURI(id)
      const query = { _id: { $ne: id }, subject }
      const news = await examRepo.getExamNoPaging(query)
      if (news) {
        return res.status(httpCode.SUCCESS).json(news)
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const getExamById = async (req, res) => {
    try {
      let { id } = req.params
      id = decodeURI(id)
      const query = { $or: [{ slug: id }] }
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        query.$or.push({ _id: id })
      }
      const news = await examRepo.getExam(query)
      if (news) {
        return res.status(httpCode.SUCCESS).json(news)
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const removeExamById = async (req, res) => {
    try {
      const { id } = req.params
      if (id && id.length === 24) {
        await examRepo.deleteExam(id)
        return res.status(httpCode.SUCCESS).json({ ok: true })
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const updateExamById = async (req, res) => {
    try {
      const { id } = req.params
      const body = req.body
      if (id && id.length === 24) {
        const item = await examRepo.getExamById(id)
        if (item) {
          body.slug = serverHelper.stringToSlug(body.title)
          body.keyword = serverHelper.stringToSlugSearch(body.title)
          body.updatedAt = Math.floor(Date.now() / 1000)
          const {
            error,
            value
          } = await schemaValidator(body, 'Exam')
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
          await examRepo.updateExam(id, value)
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
  const createExam = async (req, res) => {
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
        } = await schemaValidator(body, 'Exam')
        if (error) {
          logger.e(error)
          return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
        }
        const news = await examRepo.createExam(value)
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
  const updateQuestion = async (req, res) => {
    try {
      const { listQuestion, listTypeQuestion } = req.body
      const { id } = req.params
      const qq = []
      for (const va of listQuestion) {
        const { error, value } = schemaValidator(va, 'Question')
        if (error) {
          return res.status(httpCode.BAD_REQUEST).json({ msg: 'loi roi' })
        }
        const v = questionRepo.createQuestion(value)
        qq.push(v)
      }
      const aa = await Promise.all(qq)
      const ids = []
      for (let a of aa) {
        a = a.toObject()
        ids.push(a._id)
      }
      await examRepo.updateExam(id, { questionIds: ids, listTypeQuestion: listTypeQuestion })
      res.status(httpCode.SUCCESS).json({ ok: true })
    } catch (e) {
      logger.e(e)
      if (e.code === 11000) {
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'Tiêu đề đã tồn tại!' })
      }
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  return {
    getListExam,
    getExamById,
    removeExamById,
    updateExamById,
    createExam,
    updateQuestion,
    getExamRelated,
    getListQuestionExam,
    getListToeic
  }
}

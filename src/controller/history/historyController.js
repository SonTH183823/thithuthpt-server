module.exports = (container) => {
  const logger = container.resolve('logger')
  const { httpCode, serverHelper } = container.resolve('config')
  const { historyRepo, examRepo, userRepo, notificationRepo } = container.resolve('repo')
  const { handlePushFCM } = container.resolve('notification')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator,
    schemas: {
      History
    }
  } = container.resolve('models')
  
  const getListHistory = async (req, res) => {
    try {
      let {
        page,
        perPage,
        sort,
        startTime,
        endTime,
        subject,
        userId
      } = req.query
      page = +page || 1
      perPage = +perPage || 10
      sort = +sort === 0 ? { createdAt: 1 } : +sort || { createdAt: -1 }
      const skip = (page - 1) * perPage
      const search = { ...req.query }
      let pipe = {}
      pipe.userId = ObjectId(userId)
      if (startTime) {
        pipe.createdAt = { $gte: startTime }
      }
      if (endTime) {
        pipe.createdAt = { ...pipe.createdAt, $lte: endTime }
      }
      if (subject) {
        pipe.subject = subject
      } else {
        pipe.subject = { $lte: 8 }
      }
      delete search.page
      delete search.userId
      delete search.perPage
      delete search.sort
      delete search.startTime
      delete search.endTime
      delete search.subject
      
      Object.keys(search).forEach(key => {
        const value = search[key]
        const pathType = (History.schema.path(key) || {}).instance || ''
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
      const data = await historyRepo.getListHistory(pipe, perPage, skip, sort)
      const total = await historyRepo.getCount(pipe)
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
  const getListBHXByExamId = async (req, res) => {
    try {
      let {
        page,
        perPage,
        startTime,
        endTime,
        subject
      } = req.query
      const sort = { point: -1, timeSpent: -1 }
      const { id } = req.params
      page = +page || 1
      perPage = +perPage || 10
      const skip = (page - 1) * perPage
      const search = { ...req.query }
      let pipe = {}
      pipe.examId = ObjectId(id)
      if (startTime) {
        pipe.createdAt = { $gte: startTime }
      }
      if (endTime) {
        pipe.createdAt = { ...pipe.createdAt, $lte: endTime }
      }
      if (subject) {
        pipe.subject = subject
      } else {
        pipe.subject = { $lte: 8 }
      }
      delete search.page
      delete search.perPage
      delete search.sort
      delete search.startTime
      delete search.endTime
      delete search.subject
      Object.keys(search).forEach(key => {
        const value = search[key]
        const pathType = (History.schema.path(key) || {}).instance || ''
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
      const data = await historyRepo.getListHistoryBXH(pipe, perPage, skip, sort)
      const total = await historyRepo.getCount(pipe)
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
        startTime,
        endTime
      } = req.query
      page = +page || 1
      perPage = +perPage || 10
      const skip = (page - 1) * perPage
      sort = +sort === 0 ? { createdAt: 1 } : +sort || { createdAt: -1 }
      const search = { ...req.query }
      const pipe = {}
      pipe.subject = { $eq: 9 }
      if (startTime) {
        pipe.createdAt = { $gte: startTime }
      }
      if (endTime) {
        pipe.createdAt = { ...pipe.createdAt, $lte: endTime }
      }
      delete search.page
      delete search.perPage
      delete search.sort
      delete search.startTime
      delete search.endTime
      
      Object.keys(search).forEach(key => {
        const value = search[key]
        const pathType = (History.schema.path(key) || {}).instance || ''
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
      const data = await historyRepo.getListHistory(pipe, perPage, skip, sort)
      const total = await historyRepo.getCount(pipe)
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
  const getHistoryById = async (req, res) => {
    try {
      let { id } = req.params
      id = decodeURI(id)
      const query = { $or: [{ slug: id }] }
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        query.$or.push({ _id: id })
      }
      const news = await historyRepo.getHistory(query)
      if (news) {
        return res.status(httpCode.SUCCESS).json(news)
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const removeHistoryById = async (req, res) => {
    try {
      const { id } = req.params
      if (id && id.length === 24) {
        await historyRepo.deleteHistory(id)
        return res.status(httpCode.SUCCESS).json({ ok: true })
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  const updateHistoryById = async (req, res) => {
    try {
      const { id } = req.params
      const body = req.body
      if (id && id.length === 24) {
        const item = await historyRepo.getHistoryById(id)
        if (item) {
          body.updatedAt = Math.floor(Date.now() / 1000)
          const {
            error,
            value
          } = await schemaValidator(body, 'History')
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
          await historyRepo.updateHistory(id, value)
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
  const createHistory = async (req, res) => {
    try {
      const { userId } = req.user
      const body = req.body
      if (body && body.examId) {
        let exam = await examRepo.getExamQuestion(ObjectId(body.examId))
        if (exam) {
          exam = exam.toObject()
          if (exam.subject !== 9) {
            const {
              numRight,
              rsTypeQuestion
            } = serverHelper.caculatorResultExam(body.listAnswer, exam.questionIds, exam.listTypeQuestion)
            body.numberQuestionRight = numRight
            body.point = numRight / exam.numberQuestion * 10
            body.rsTypeQuestion = rsTypeQuestion
          } else {
            body.cateToeic = exam.cateToeic
            body.numberListeningQuestionRight = serverHelper.caculatorResultToeic(body.listListeningAnswer, exam.listeningQuestion)
            body.numberReadingQuestionRight = serverHelper.caculatorResultToeic(body.listReadingAnswer, exam.readingQuestion)
            body.point = serverHelper.caculatorPointExam(body.numberListeningQuestionRight, exam.numberListening, body.numberReadingQuestionRight, exam.numberReading)
            const rsTypeQuestion = []
            for (const item of exam.listTypeQuestion) {
              const tmp = {
                id: item._id,
                label: item.label,
                value: 0
              }
              if (item.label === 'Listening') {
                tmp.value = body.numberListeningQuestionRight
              } else if (item.label === 'Reading') {
                tmp.value = body.numberReadingQuestionRight
              }
              rsTypeQuestion.push(tmp)
            }
            body.rsTypeQuestion = rsTypeQuestion
          }
          body.subject = exam.subject
          body.updatedAt = Math.floor(Date.now() / 1000)
          body.userId = userId
          const {
            error,
            value
          } = await schemaValidator(body, 'History')
          if (error) {
            logger.e(error)
            return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
          }
          const item = await historyRepo.createHistory(value)
          const user = await userRepo.getUserById(ObjectId(userId))
          let pAdd = exam.subject !== 9 ? Math.round(body.point) : Math.round(body.point / 10)
          if (pAdd > 10) pAdd = Math.round(pAdd / 10)
          await userRepo.updateUser(ObjectId(userId), { pointCredits: user.pointCredits + pAdd })
          const { notiData, messages } = serverHelper.genDataAwards(user, pAdd, 2)
          if (userId) {
            const {
              error, value
            } = await schemaValidator(notiData, 'Notification')
            if (error) {
              logger.e(error)
              return res.status(httpCode.BAD_REQUEST).json({ msg: error.message })
            }
            await notificationRepo.createNotification(value)
          }
          if (user.fcmToken) {
            await handlePushFCM(messages)
          }
          return res.status(httpCode.CREATED).json(item)
        }
        return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
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
  const getTotalHistory = async (req, res) => {
    try {
      const history = await historyRepo.getCount()
      if (history) {
        return res.status(httpCode.SUCCESS).json({
          totalHistory: history
        })
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  
  const getStatisticalHistory = async (req, res) => {
    const { userId } = req.user
    const { subject } = req.query
    try {
      let pipe = {}
      if (subject) {
        pipe.subject = subject
      } else {
        pipe.subject = { $lte: 8 }
      }
      const histories = await historyRepo.findHistory({ userId: ObjectId(userId), ...pipe })
      if (histories) {
        return res.status(httpCode.SUCCESS).json({
          data: histories
        })
      }
      return res.status(httpCode.BAD_REQUEST).json({ msg: 'BAD REQUEST' })
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).json({ msg: 'UNKNOWN ERROR' })
    }
  }
  
  return {
    getListBHXByExamId,
    getListHistory,
    getStatisticalHistory,
    getHistoryById,
    removeHistoryById,
    updateHistoryById,
    createHistory,
    getListToeic,
    getTotalHistory
  }
}

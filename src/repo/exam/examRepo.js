module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Exam } = schemas
  const createExam = (data) => {
    const n = new Exam(data)
    return n.save()
  }
  const getExamById = (id) => {
    return Exam.findById(id)
  }
  const deleteExam = (id) => {
    return Exam.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateExam = (id, n) => {
    return Exam.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return Exam.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return Exam.countDocuments(pipe)
  }
  const getExamAgg = (pipe) => {
    return Exam.aggregate(pipe)
  }
  const getListExam = (pipe, limit, skip, sort) => {
    return Exam.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getListQuestionExam = (id) => {
    return Exam.findOne(id).populate('questionIds listeningQuestion readingQuestion')
  }
  const getExamNoPaging = (pipe, limit) => {
    return Exam.find(pipe).limit(limit)
  }
  const removeExam = (pipe) => {
    return Exam.deleteMany(pipe)
  }
  const getExam = async (id) => {
    return Exam.findOne(id)
  }
  const getExamQuestion = async (id) => {
    return Exam.findOne(id).populate('questionIds listeningQuestion readingQuestion')
  }
  const findOne = async (pipe) => {
    return Exam.findOne(pipe)
  }
  const findExam = (pipe) => {
    return Exam.find(pipe)
  }
  const updateMany = (con, up) => {
    return Exam.updateMany(con, up)
  }
  const find = (con, up) => {
    return Exam.updateMany(con, up)
  }
  return {
    find,
    findOne,
    getExamNoPaging,
    removeExam,
    createExam,
    getExamAgg,
    getExamById,
    deleteExam,
    updateExam,
    checkIdExist,
    getCount,
    getExam,
    getListExam,
    updateMany,
    findExam,
    getListQuestionExam,
    getExamQuestion
  }
}

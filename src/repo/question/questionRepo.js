module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Question } = schemas
  const createQuestion = (data) => {
    const n = new Question(data)
    return n.save()
  }
  const getQuestionById = (id) => {
    return Question.findById(id).populate('category tags')
  }
  const deleteQuestion = (id) => {
    return Question.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateQuestion = (id, n) => {
    return Question.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return Question.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return Question.countDocuments(pipe)
  }
  const getQuestionAgg = (pipe) => {
    return Question.aggregate(pipe)
  }
  const getListQuestion = (pipe, limit, skip, sort) => {
    return Question.find(pipe).limit(limit).skip(skip).sort(sort).populate('category tags')
  }
  const getQuestionNoPaging = (pipe) => {
    return Question.find(pipe).populate('category tags')
  }
  const removeQuestion = (pipe) => {
    return Question.deleteMany(pipe)
  }
  const getQuestion = async (id) => {
    return Question.findOne(id).populate('category tags')
  }
  const findOne = async (pipe) => {
    return Question.findOne(pipe)
  }
  const findQuestion = (pipe) => {
    return Question.find(pipe)
  }
  const updateMany = (con, up) => {
    return Question.updateMany(con, up)
  }
  const find = (con, up) => {
    return Question.updateMany(con, up)
  }
  return {
    find,
    findOne,
    getQuestionNoPaging,
    removeQuestion,
    createQuestion,
    getQuestionAgg,
    getQuestionById,
    deleteQuestion,
    updateQuestion,
    checkIdExist,
    getCount,
    getQuestion,
    getListQuestion,
    updateMany,
    findQuestion
  }
}

module.exports = container => {
  const { schemas } = container.resolve('models')
  const { History } = schemas
  const createHistory = (data) => {
    const n = new History(data)
    return n.save()
  }
  const getHistoryById = (id) => {
    return History.findById(id)
  }
  const deleteHistory = (id) => {
    return History.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateHistory = (id, n) => {
    return History.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkExist = (userId, examId) => {
    return History.findOne({ userId, examId })
  }
  const getCount = (pipe = {}) => {
    return History.countDocuments(pipe)
  }
  const getHistoryAgg = (pipe) => {
    return History.aggregate(pipe)
  }
  const getListHistory = (pipe, limit, skip, sort) => {
    return History.find(pipe).limit(limit).skip(skip).sort(sort).populate('examId')
  }
  const getListQuestionHistory = (id) => {
    return History.findOne(id).populate('questionIds listeningQuestion readingQuestion')
  }
  const getHistoryNoPaging = (pipe, limit) => {
    return History.find(pipe).limit(limit)
  }
  const removeHistory = (pipe) => {
    return History.deleteMany(pipe)
  }
  const getHistory = async (id) => {
    return History.findOne(id)
  }
  const findOne = async (pipe) => {
    return History.findOne(pipe)
  }
  const findHistory = (pipe) => {
    return History.find(pipe)
  }
  const updateMany = (con, up) => {
    return History.updateMany(con, up)
  }
  const find = (con, up) => {
    return History.updateMany(con, up)
  }
  return {
    find,
    findOne,
    getHistoryNoPaging,
    removeHistory,
    createHistory,
    getHistoryAgg,
    getHistoryById,
    deleteHistory,
    updateHistory,
    checkExist,
    getCount,
    getHistory,
    getListHistory,
    updateMany,
    findHistory,
    getListQuestionHistory
  }
}

module.exports = container => {
  const { schemas } = container.resolve('models')
  const { FavoriteExam } = schemas
  const createFavoriteExam = (data) => {
    const n = new FavoriteExam(data)
    return n.save()
  }
  const getFavoriteExamById = (id) => {
    return FavoriteExam.findById(id)
  }
  const deleteFavoriteExam = (id) => {
    return FavoriteExam.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateFavoriteExam = (id, n) => {
    return FavoriteExam.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return FavoriteExam.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return FavoriteExam.countDocuments(pipe)
  }
  const getFavoriteExamAgg = (pipe) => {
    return FavoriteExam.aggregate(pipe)
  }
  const getListFavoriteExam = (pipe, limit, skip, sort) => {
    return FavoriteExam.find(pipe).limit(limit).skip(skip).sort(sort).populate('examId')
  }
  const getListQuestionFavoriteExam = (id) => {
    return FavoriteExam.findOne(id).populate('questionIds')
  }
  const getFavoriteExamNoPaging = (pipe) => {
    return FavoriteExam.find(pipe)
  }
  const removeFavoriteExam = (pipe) => {
    return FavoriteExam.deleteMany(pipe)
  }
  const getFavoriteExam = async (id) => {
    return FavoriteExam.findOne(id)
  }
  const findOne = async (pipe) => {
    return FavoriteExam.findOne(pipe)
  }
  const findFavoriteExam = (pipe) => {
    return FavoriteExam.find(pipe)
  }
  const updateMany = (con, up) => {
    return FavoriteExam.updateMany(con, up)
  }
  const find = (con, up) => {
    return FavoriteExam.updateMany(con, up)
  }
  return {
    find,
    findOne,
    getFavoriteExamNoPaging,
    removeFavoriteExam,
    createFavoriteExam,
    getFavoriteExamAgg,
    getFavoriteExamById,
    deleteFavoriteExam,
    updateFavoriteExam,
    checkIdExist,
    getCount,
    getFavoriteExam,
    getListFavoriteExam,
    updateMany,
    findFavoriteExam,
    getListQuestionFavoriteExam
  }
}

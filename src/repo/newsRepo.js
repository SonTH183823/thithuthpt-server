module.exports = container => {
  const { schemas } = container.resolve('models')
  const { News } = schemas
  const createNews = (data) => {
    const n = new News(data)
    return n.save()
  }
  const getNewsById = (id) => {
    return News.findById(id).populate('category tags')
  }
  const deleteNews = (id) => {
    return News.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateNews = (id, n) => {
    return News.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return News.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return News.countDocuments(pipe)
  }
  const getNewsAgg = (pipe) => {
    return News.aggregate(pipe)
  }
  const getListNews = (pipe, limit, skip, sort) => {
    return News.find(pipe).limit(limit).skip(skip).sort(sort).populate('category tags')
  }
  const getNewsNoPaging = (pipe) => {
    return News.find(pipe).populate('category tags')
  }
  const removeNews = (pipe) => {
    return News.deleteMany(pipe)
  }
  const getNews = async (id) => {
    return News.findOne(id).populate('category tags')
  }
  const findOne = async (pipe) => {
    return News.findOne(pipe)
  }
  const findNews = (pipe) => {
    return News.find(pipe)
  }
  const updateMany = (con, up) => {
    return News.updateMany(con, up)
  }
  const find = (con, up) => {
    return News.updateMany(con, up)
  }
  return {
    find,
    findOne,
    getNewsNoPaging,
    removeNews,
    createNews,
    getNewsAgg,
    getNewsById,
    deleteNews,
    updateNews,
    checkIdExist,
    getCount,
    getNews,
    getListNews,
    updateMany,
    findNews
  }
}

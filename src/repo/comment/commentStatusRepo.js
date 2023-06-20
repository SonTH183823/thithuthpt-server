module.exports = container => {
  const { schemas } = container.resolve('models')
  const { CommentStatus } = schemas
  const createCommentStatus = (data) => {
    const n = new CommentStatus(data)
    return n.save()
  }
  const getCommentStatusById = (id) => {
    return CommentStatus.findById(id)
  }
  const deleteCommentStatus = (id) => {
    return CommentStatus.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateCommentStatus = (id, n) => {
    return CommentStatus.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return CommentStatus.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return CommentStatus.countDocuments(pipe)
  }
  const getCommentStatusAgg = (pipe) => {
    return CommentStatus.aggregate(pipe)
  }
  const getCommentStatus = (pipe, limit, skip, sort) => {
    return CommentStatus.find(pipe).limit(limit).skip(skip).sort(sort).populate('userId')
  }
  const getCommentStatusNoPaging = (pipe) => {
    return CommentStatus.find(pipe)
  }
  const removeCommentStatus = (pipe) => {
    return CommentStatus.deleteMany(pipe)
  }
  return {
    getCommentStatusNoPaging,
    removeCommentStatus,
    createCommentStatus,
    getCommentStatusAgg,
    getCommentStatusById,
    deleteCommentStatus,
    updateCommentStatus,
    checkIdExist,
    getCount,
    getCommentStatus
  }
}

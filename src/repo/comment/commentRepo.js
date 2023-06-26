module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Comment } = schemas
  const createComment = (data) => {
    const n = new Comment(data)
    return n.save()
  }
  const getCommentById = (id) => {
    return Comment.findById(id)
  }
  const getAllUserId = (pipe) => {
    return Comment.aggregate(pipe)
  }
  const deleteComment = (id) => {
    return Comment.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateComment = (id, n) => {
    return Comment.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return Comment.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return Comment.countDocuments(pipe)
  }
  const getCommentAgg = (pipe) => {
    return Comment.aggregate(pipe)
  }
  const getComment = (pipe, limit, skip, sort) => {
    return Comment.find(pipe).limit(limit).skip(skip).sort(sort).populate('userId')
  }
  const getCommentNoPaging = (pipe) => {
    return Comment.find(pipe)
  }
  const removeComment = (pipe) => {
    return Comment.deleteMany(pipe)
  }
  return {
    getCommentNoPaging,
    removeComment,
    createComment,
    getCommentAgg,
    getCommentById,
    deleteComment,
    updateComment,
    checkIdExist,
    getCount,
    getComment,
    getAllUserId
  }
}

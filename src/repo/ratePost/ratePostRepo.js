module.exports = container => {
  const { schemas } = container.resolve('models')
  const { RatePost } = schemas
  const createRatePost = (data) => {
    const n = new RatePost(data)
    return n.save()
  }
  const getRatePostById = (id) => {
    return RatePost.findById(id)
  }
  const deleteRatePost = (id) => {
    return RatePost.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateRatePost = (id, n) => {
    return RatePost.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const getRateByPostAndUser = (pipe) => {
    return RatePost.findOne(pipe)
  }
  const getCount = (pipe = {}) => {
    return RatePost.countDocuments(pipe)
  }
  const getRatePostAgg = (pipe) => {
    return RatePost.aggregate(pipe)
  }
  const getRatePost = (pipe, limit, skip, sort) => {
    return RatePost.find(pipe).limit(limit).skip(skip).sort(sort).populate('userId')
  }
  const getRatePostNoPaging = (pipe) => {
    return RatePost.find(pipe)
  }
  const removeRatePost = (pipe) => {
    return RatePost.deleteMany(pipe)
  }
  return {
    getRatePostNoPaging,
    removeRatePost,
    createRatePost,
    getRatePostAgg,
    getRatePostById,
    deleteRatePost,
    updateRatePost,
    getRateByPostAndUser,
    getCount,
    getRatePost
  }
}

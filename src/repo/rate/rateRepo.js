module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Rate } = schemas
  const createRate = (data) => {
    const n = new Rate(data)
    return n.save()
  }
  const getRateById = (id) => {
    return Rate.findById(id)
  }
  const deleteRate = (id) => {
    return Rate.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateRate = (id, n) => {
    return Rate.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return Rate.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return Rate.countDocuments(pipe)
  }
  const getRateAgg = (pipe) => {
    return Rate.aggregate(pipe)
  }
  const getRate = (pipe, limit, skip, sort) => {
    return Rate.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getRateNoPaging = (pipe) => {
    return Rate.find(pipe)
  }
  const removeRate = (pipe) => {
    return Rate.deleteMany(pipe)
  }
  return {
    getRateNoPaging,
    removeRate,
    createRate,
    getRateAgg,
    getRateById,
    deleteRate,
    updateRate,
    checkIdExist,
    getCount,
    getRate
  }
}

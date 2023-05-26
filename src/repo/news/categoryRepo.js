module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Category } = schemas
  const createCategory = (data) => {
    const n = new Category(data)
    return n.save()
  }
  const getCategoryById = (id) => {
    return Category.findById(id)
  }
  const deleteCategory = (id) => {
    return Category.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateCategory = (id, n) => {
    return Category.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return Category.findOne({ id })
  }
  const findOne = (pipe) => {
    return Category.findOne(pipe)
  }
  const getCount = (pipe = {}) => {
    return Category.countDocuments(pipe)
  }
  const getCategoryAgg = (pipe) => {
    return Category.aggregate(pipe)
  }
  const getCategory = (pipe, limit, skip, sort) => {
    return Category.find(pipe).limit(limit).skip(skip).sort(sort).populate('createdBy', '-password')
  }
  const getCategoryNoPaging = (pipe) => {
    return Category.find(pipe)
  }
  const removeCategory = (pipe) => {
    return Category.deleteMany(pipe)
  }
  return {
    getCategoryNoPaging,
    removeCategory,
    createCategory,
    getCategoryAgg,
    getCategoryById,
    deleteCategory,
    updateCategory,
    checkIdExist,
    getCount,
    getCategory,
    findOne
  }
}

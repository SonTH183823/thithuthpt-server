module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Tag } = schemas
  const createTag = (data) => {
    const n = new Tag(data)
    return n.save()
  }
  const getTagNewsById = (id) => {
    return Tag.findById(id)
  }
  const deleteTag = (id) => {
    return Tag.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateTag = (id, data) => {
    return Tag.findByIdAndUpdate(id, data, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return Tag.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return Tag.countDocuments(pipe)
  }
  const getTagAgg = (pipe) => {
    return Tag.aggregate(pipe)
  }
  const getTag = (pipe, limit, skip, sort) => {
    return Tag.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getTagNoPaging = (pipe) => {
    return Tag.find(pipe)
  }
  const removeTag = (pipe) => {
    return Tag.deleteMany(pipe)
  }
  return {
    getTagNoPaging,
    removeTag,
    createTag,
    getTagAgg,
    getTagNewsById,
    deleteTag,
    updateTag,
    checkIdExist,
    getCount,
    getTag
  }
}

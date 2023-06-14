module.exports = container => {
  const { schemas } = container.resolve('models')
  const { PartSubject } = schemas
  const createPartSubject = (data) => {
    const n = new PartSubject(data)
    return n.save()
  }
  const getPartSubjectById = (id) => {
    return PartSubject.findById(id)
  }
  const deletePartSubject = (id) => {
    return PartSubject.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updatePartSubject = (id, n) => {
    return PartSubject.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return PartSubject.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return PartSubject.countDocuments(pipe)
  }
  const getPartSubjectAgg = (pipe) => {
    return PartSubject.aggregate(pipe)
  }
  const getListPartSubject = (pipe, limit, skip, sort) => {
    return PartSubject.find(pipe).limit(limit).skip(skip).sort(sort).populate('category tags')
  }
  const getPartSubjectNoPaging = (pipe) => {
    return PartSubject.find(pipe).populate('category tags')
  }
  const removePartSubject = (pipe) => {
    return PartSubject.deleteMany(pipe)
  }
  const getPartSubject = async (id) => {
    return PartSubject.findOne(id).populate('category tags')
  }
  const findOne = async (pipe) => {
    return PartSubject.findOne(pipe)
  }
  const findPartSubject = (pipe) => {
    return PartSubject.find(pipe)
  }
  const updateMany = (con, up) => {
    return PartSubject.updateMany(con, up)
  }
  const find = (con, up) => {
    return PartSubject.updateMany(con, up)
  }
  return {
    find,
    findOne,
    getPartSubjectNoPaging,
    removePartSubject,
    createPartSubject,
    getPartSubjectAgg,
    getPartSubjectById,
    deletePartSubject,
    updatePartSubject,
    checkIdExist,
    getCount,
    getPartSubject,
    getListPartSubject,
    updateMany,
    findPartSubject
  }
}

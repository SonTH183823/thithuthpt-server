module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Document } = schemas
  const createDocument = (data) => {
    const n = new Document(data)
    return n.save()
  }
  const getDocumentById = (id) => {
    return Document.findById(id)
  }
  const deleteDocument = (id) => {
    return Document.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateDocument = (id, n) => {
    return Document.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return Document.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return Document.countDocuments(pipe)
  }
  const getDocumentAgg = (pipe) => {
    return Document.aggregate(pipe)
  }
  const getListDocument = (pipe, limit, skip, sort) => {
    return Document.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getListQuestionDocument = (id) => {
    return Document.findOne(id).populate('questionIds')
  }
  const getDocumentNoPaging = (pipe) => {
    return Document.find(pipe)
  }
  const removeDocument = (pipe) => {
    return Document.deleteMany(pipe)
  }
  const getDocument = async (id) => {
    return Document.findOne(id)
  }
  const findOne = async (pipe) => {
    return Document.findOne(pipe)
  }
  const findDocument = (pipe) => {
    return Document.find(pipe)
  }
  const updateMany = (con, up) => {
    return Document.updateMany(con, up)
  }
  const find = (con, up) => {
    return Document.updateMany(con, up)
  }
  return {
    find,
    findOne,
    getDocumentNoPaging,
    removeDocument,
    createDocument,
    getDocumentAgg,
    getDocumentById,
    deleteDocument,
    updateDocument,
    checkIdExist,
    getCount,
    getDocument,
    getListDocument,
    updateMany,
    findDocument,
    getListQuestionDocument
  }
}

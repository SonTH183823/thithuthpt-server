module.exports = (joi, mongoose, {
  joi2MongoSchema,
  schemas
}) => {
  const subjectConfig = {
    TOAN: 1,
    LY: 2,
    HOA: 3,
    SINH: 4,
    ANH: 5,
    SU: 6,
    DIA: 7,
    GDCD: 8,
    TOEIC: 9
  }
  const partSubjectJoi = joi.object({
    subject: joi.number().valid(...Object.values(subjectConfig)).default(1),
    name: joi.string().required(),
    thumbnail: joi.string().required()
  })
  const partSubjectSchema = joi2MongoSchema(partSubjectJoi, {}, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  partSubjectSchema.statics.validateObj = (obj, config = {}) => {
    return partSubjectJoi.validate(obj, config)
  }
  partSubjectSchema.statics.validateDocument = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return partSubjectJoi.validate(obj, config)
  }
  const rateModel = mongoose.model('PartSubject', partSubjectSchema)
  rateModel.syncIndexes()
  return rateModel
}

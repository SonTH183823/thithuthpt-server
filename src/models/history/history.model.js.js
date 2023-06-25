module.exports = (joi, mongoose, {
  joi2MongoSchema,
  schemas
}) => {
  const categoryConfig = {
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
  const typeCateToeic = {
    BODE: 1,
    RUTGON: 2
  }
  const answerConfig = {
    NO: 0,
    A: 1,
    B: 2,
    C: 3,
    D: 4
  }
  const ObjectId = mongoose.Types.ObjectId
  const historyJoi = joi.object({
    subject: joi.number().valid(...Object.values(categoryConfig)),
    cateToeic: joi.number().valid(...Object.values(typeCateToeic)),
    userId: joi.string().required(),
    examId: joi.string().required(),
    description: joi.string().allow(''),
    listAnswer: joi.array().items(joi.number().valid(...Object.values(answerConfig))),
    listListeningAnswer: joi.array().items(joi.number().valid(...Object.values(answerConfig))),
    listReadingAnswer: joi.array().items(joi.number().valid(...Object.values(answerConfig))),
    numberQuestionRight: joi.number(),
    numberListeningQuestionRight: joi.number(),
    numberReadingQuestionRight: joi.number(),
    point: joi.number().default(0),
    timeSpent: joi.number(),
    rsTypeQuestion: joi.array().items(joi.object({
      id: joi.string(),
      label: joi.string(),
      value: joi.number(),
      total: joi.number()
    }).allow({}))
  })
  const historySchema = joi2MongoSchema(historyJoi, {
    examId: {
      type: ObjectId,
      ref: 'Exam'
    },
    userId: {
      type: ObjectId,
      ref: 'user'
    }
  }, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  historySchema.statics.validateObj = (obj, config = {}) => {
    return historyJoi.validate(obj, config)
  }
  historySchema.statics.validateDocument = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return historyJoi.validate(obj, config)
  }
  const historyModel = mongoose.model('History', historySchema)
  historyModel.syncIndexes()
  return historyModel
}

module.exports = (joi, mongoose, {
  joi2MongoSchema,
  schemas
}) => {
  const answerConfig = {
    A: 1,
    B: 2,
    C: 3,
    D: 4
  }
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
  const questionJoi = joi.object({
    content: joi.string().required(),
    answer: joi.number().valid(...Object.values(answerConfig)).required(),//đáp án
    explanation: joi.string().allow(''),//lời giải
    subject: joi.number().valid(...Object.values(categoryConfig)).required(),
    description: joi.string().allow(''),
    slug: joi.string(),
    createdBy: joi.string(),
    active: joi.number().valid(0, 1).default(1),
    delete: joi.number().valid(0, 1).default(0),
    updatedAt: joi.number()
  })
  const questionSchema = joi2MongoSchema(questionJoi, {
    slug: {
      type: String,
      unique: true
    }
  }, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  questionSchema.statics.validateObj = (obj, config = {}) => {
    return questionJoi.validate(obj, config)
  }
  questionSchema.statics.validateDocument = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return questionJoi.validate(obj, config)
  }
  const questionModel = mongoose.model('Question', questionSchema)
  questionModel.syncIndexes()
  return questionModel
}
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
  const ObjectId = mongoose.Types.ObjectId
  const examJoi = joi.object({
    category: joi.number().valid(...Object.values(categoryConfig)).required(),
    title: joi.string().required(),
    thumbnail: joi.string().allow(''),
    description: joi.string().allow(''),
    slug: joi.string(),
    updatedAt: joi.number(),
    active: joi.number().valid(0, 1).default(0),
    createdBy: joi.string(),
    delete: joi.number().valid(0, 1).default(0),
    questionIds: joi.array().items(joi.string()),
    rating: joi.number().default(0),
    time: joi.number(),
    numberTest: joi.number().default(0),
    numberView: joi.number().default(0),
    listTypeQuestion: joi.array().items(joi.object({
      label: joi.string().required(),
      value: joi.number()
    }).allow({}))
  })
  const examSchema = joi2MongoSchema(examJoi, {
    slug: {
      type: String,
      unique: true
    },
    questionIds: [{
      type: ObjectId,
      ref: 'Question'
    }]
  }, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  examSchema.statics.validateObj = (obj, config = {}) => {
    return examJoi.validate(obj, config)
  }
  examSchema.statics.validateDocument = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return examJoi.validate(obj, config)
  }
  const examModel = mongoose.model('Exam', examSchema)
  examModel.syncIndexes()
  return examModel
}

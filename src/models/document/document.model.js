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
    subject: joi.number().valid(...Object.values(categoryConfig)).required(),
    category: joi.string().allow(''),
    title: joi.string().required(),
    thumbnail: joi.string().allow(''),
    description: joi.string().allow(''),
    link: joi.string().required(),
    slug: joi.string(),
    updatedAt: joi.number(),
    active: joi.number().valid(0, 1).default(0),
    createdBy: joi.string(),
    delete: joi.number().valid(0, 1).default(0),
    questionIds: joi.array().items(joi.string()).default([]),
    rate: joi.number().default(0),
    outstanding: joi.number().default(0),
    keyword: joi.string()
  })
  const documentSchema = joi2MongoSchema(examJoi, {
    slug: {
      type: String,
      unique: true
    },
    keyword: {
      lowercase: true,
      type: String
    },
    category: [{
      type: ObjectId,
      ref: 'PartSubject'
    }]
  }, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  documentSchema.statics.validateObj = (obj, config = {}) => {
    return examJoi.validate(obj, config)
  }
  documentSchema.statics.validateDocument = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return examJoi.validate(obj, config)
  }
  const documentModel = mongoose.model('Document', documentSchema)
  documentModel.syncIndexes()
  return documentModel
}

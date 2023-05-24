module.exports = (joi, mongoose, {
  joi2MongoSchema,
  schemas
}) => {
  const ObjectId = mongoose.Types.ObjectId
  const newsJoi = joi.object({
    title: joi.string().required(),
    thumbnail: joi.string(),
    description: joi.string().allow(''),
    slug: joi.string(),
    content: joi.string().required(),
    isOutstanding: joi.number().valid(0, 1).default(0),
    isManyViewed: joi.number().valid(0, 1).default(0),
    createdBy: joi.string(),
    category: joi.array().items(joi.string()),
    tags: joi.array().items(joi.string()),
    active: joi.number().valid(0, 1).default(0),
    customAttributes: joi.object({}).unknown(true),
    delete: joi.number().valid(0, 1).default(0),
    keyword: joi.string(),
    updatedAt: joi.number(),
    hasNotification: joi.number().valid(0, 1).default(0)
  })
  const newsSchema = joi2MongoSchema(newsJoi, {
    category: [{
      type: ObjectId,
      ref: 'Category'
    }],
    tags: [{
      type: ObjectId,
      ref: 'Tag'
    }],
    slug: {
      type: String,
      unique: true
    },
    keyword: {
      lowercase: true,
      type: String
    }
  }, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  newsSchema.statics.validateObj = (obj, config = {}) => {
    return newsJoi.validate(obj, config)
  }
  newsSchema.statics.validateDocument = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return newsJoi.validate(obj, config)
  }
  const newsModel = mongoose.model('News', newsSchema)
  newsModel.syncIndexes()
  return newsModel
}

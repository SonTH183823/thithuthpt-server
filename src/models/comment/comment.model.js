module.exports = (joi, mongoose, {
  joi2MongoSchema,
  schemas
}) => {
  const ObjectId = mongoose.Types.ObjectId
  const commentJoi = joi.object({
    postId: joi.string().required(),
    thumbnail: joi.string().allow(''),
    description: joi.string().allow(''),
    slug: joi.string(),
    content: joi.string().required(),
    isOutstanding: joi.number().valid(0, 1).default(0),
    isManyViewed: joi.number().valid(0, 1).default(0),
    createdBy: joi.string(),
    category: joi.array().items(joi.string()),
    active: joi.number().valid(0, 1).default(0),
    customAttributes: joi.object({}).unknown(true),
    delete: joi.number().valid(0, 1).default(0),
    keyword: joi.string(),
    updatedAt: joi.number(),
    hasNotification: joi.number().valid(0, 1).default(0)
  })
  const commentSchema = joi2MongoSchema(commentJoi, {
    postId: {
      type: ObjectId
    },
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
  commentSchema.statics.validateObj = (obj, config = {}) => {
    return commentJoi.validate(obj, config)
  }
  commentSchema.statics.validateDocument = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return commentJoi.validate(obj, config)
  }
  const newsModel = mongoose.model('News', commentSchema)
  newsModel.syncIndexes()
  return newsModel
}

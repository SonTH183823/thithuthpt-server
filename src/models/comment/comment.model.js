module.exports = (joi, mongoose, {
  joi2MongoSchema,
  schemas
}) => {
  const ObjectId = mongoose.Types.ObjectId
  const commentJoi = joi.object({
    postId: joi.string().required(),
    parentId: joi.string().allow(''),
    userId: joi.string().required(),
    thumbnail: joi.string().allow(''),
    content: joi.string().required(),
    imageAttach: joi.string().allow(''),
    videoAttach: joi.string().allow(''),
    like: joi.number().default(0),
    dislike: joi.number().default(0)
  })
  const commentSchema = joi2MongoSchema(commentJoi, {
    postId: {
      type: ObjectId
    },
    parentId: {
      type: ObjectId,
      ref: 'Comment'
    },
    userId: {
      type: ObjectId,
      ref: 'User'
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
  const newsModel = mongoose.model('Comment', commentSchema)
  newsModel.syncIndexes()
  return newsModel
}

module.exports = (joi, mongoose, {
  joi2MongoSchema,
  schemas
}) => {
  const statusConfig = {
    LIKE: 1,
    DISLIKE: 2
  }
  const ObjectId = mongoose.Types.ObjectId
  const commentJoi = joi.object({
    commentId: joi.string().required(),
    userId: joi.string().required(),
    postId: joi.string(),
    status: joi.number().valid(...Object.values(statusConfig)).required()
  })
  const commentStatusSchema = joi2MongoSchema(commentJoi, {
    postId: {
      type: ObjectId
    },
    commentId: {
      type: ObjectId,
      ref: 'Comment'
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
  commentStatusSchema.statics.validateObj = (obj, config = {}) => {
    return commentJoi.validate(obj, config)
  }
  commentStatusSchema.statics.validateDocument = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return commentJoi.validate(obj, config)
  }
  const commentStatusModel = mongoose.model('CommentStatus', commentStatusSchema)
  commentStatusModel.syncIndexes()
  return commentStatusModel
}

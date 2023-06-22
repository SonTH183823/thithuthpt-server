module.exports = (joi, mongoose, {
  joi2MongoSchema,
  schemas
}) => {
  const ObjectId = mongoose.Types.ObjectId
  const ratePostJoi = joi.object({
    postId: joi.string().required(),
    userId: joi.string().required(),
    star: joi.number().default(0)
  })
  const ratePostSchema = joi2MongoSchema(ratePostJoi, {
    postId: {
      type: ObjectId
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
  ratePostSchema.statics.validateObj = (obj, config = {}) => {
    return ratePostJoi.validate(obj, config)
  }
  ratePostSchema.statics.validateDocument = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return ratePostJoi.validate(obj, config)
  }
  const ratePostModel = mongoose.model('RatePost', ratePostSchema)
  ratePostModel.syncIndexes()
  return ratePostModel
}

module.exports = (joi, mongoose, {
  joi2MongoSchema,
  schemas
}) => {
  const rateJoi = joi.object({
    name: joi.string(),
    avatar: joi.string(),
    star: joi.number().required(),
    comment: joi.string().required(),
    active: joi.number().valid(0, 1).default(0)
  })
  const rateSchema = joi2MongoSchema(rateJoi, {}, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  rateSchema.statics.validateObj = (obj, config = {}) => {
    return rateJoi.validate(obj, config)
  }
  rateSchema.statics.validateDocument = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return rateJoi.validate(obj, config)
  }
  const rateModel = mongoose.model('Rate', rateSchema)
  rateModel.syncIndexes()
  return rateModel
}

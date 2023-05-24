module.exports = (joi, mongoose, {
  joi2MongoSchema,
  schemas
}) => {
  const tagJoi = joi.object({
    //  name, slug, createBy
    name: joi.string().required(),
    slug: joi.string().required()
  })
  const tagSchema = joi2MongoSchema(tagJoi, {
    name: {
      type: String,
      unique: true
    }
  }, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  tagSchema.statics.validateObj = (obj, config = {}) => {
    return tagJoi.validate(obj, config)
  }
  tagSchema.statics.validateDocument = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return tagJoi.validate(obj, config)
  }
  const tagModel = mongoose.model('Tag', tagSchema)
  tagModel.syncIndexes()
  return tagModel
}

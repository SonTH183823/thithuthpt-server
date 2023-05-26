module.exports = (joi, mongoose, {
  joi2MongoSchema,
  schemas
}) => {
  const ObjectId = mongoose.Types.ObjectId
  const categoryJoi = joi.object({
    name: joi.string().required(),
    description: joi.string().allow(''),
    slug: joi.string().allow(''),
    createdBy: joi.string(),
    active: joi.number().valid(0, 1).default(0),
    isOutStanding: joi.number().valid(0, 1).default(0),
    customAttributes: joi.object({}).unknown(true),
    delete: joi.number().valid(0, 1).default(0)
  })
  const categorySchema = joi2MongoSchema(categoryJoi, {
    slug: {
      type: String,
      unique: true
    },
    createdBy: {
      type: ObjectId,
      ref: 'UserCMS'
    }
  }, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  categorySchema.statics.validateObj = (obj, config = {}) => {
    return categoryJoi.validate(obj, config)
  }
  categorySchema.statics.validateDocument = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return categoryJoi.validate(obj, config)
  }
  const categoryModel = mongoose.model('Category', categorySchema)
  categoryModel.syncIndexes()
  return categoryModel
}

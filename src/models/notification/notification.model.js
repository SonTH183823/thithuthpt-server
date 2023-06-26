module.exports = (joi, mongoose, {
  joi2MongoSchema,
  schemas
}) => {
  const ObjectId = mongoose.Types.ObjectId
  const notificationJoi = joi.object({
    content: joi.string().required(),
    isViewed: joi.number().valid(0, 1).default(0),
    isRead: joi.number().valid(0, 1).default(0),
    directLink: joi.string(),
    updatedAt: joi.number(),
    userId: joi.string().required(),
    userPushId: joi.string(),
    type: joi.number()
  })
  const notificationSchema = joi2MongoSchema(notificationJoi, {
    userId: {
      type: ObjectId,
      ref: 'user'
    },
    userPushId: {
      type: ObjectId,
      ref: 'user'
    }
  }, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  notificationSchema.statics.validateObj = (obj, config = {}) => {
    return notificationJoi.validate(obj, config)
  }
  notificationSchema.statics.validateDocument = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return notificationJoi.validate(obj, config)
  }
  const notificationModel = mongoose.model('Notification', notificationSchema)
  notificationModel.syncIndexes()
  return notificationModel
}

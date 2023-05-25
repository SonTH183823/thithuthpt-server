const roleConfig = {
  NEWS: 1,
  DOCUMENTS: 2,
  TOEIC: 3,
  EXAMTEST: 4,
  INTRODUCTION: 5
}

module.exports = (joi, mongoose) => {
  const userSchema = mongoose.Schema({
    name: { type: String },
    username: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },
    password: { type: String },
    roles: [{
      type: Number
    }],
    created: {
      type: Number,
      default: Date.now
    },
    avatar: { type: String },
    isAdministrator: {
      type: Number,
      default: 0
    },
    activated: {
      type: Number,
      enum: [0, 1],
      default: 1
    }
  })
  const userJoi = joi.object({
    name: joi.string().allow(''),
    username: joi.string().pattern(/^(?=.{1,100}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/).required(),
    roles: joi.array().items(joi.string()).default([]),
    avatar: joi.string().allow('').default(''),
    password: joi.string().min(1),
    activated: joi.number().valid(0, 1).default(1),
    isAdministrator: joi.number().valid(0, 1).default(0)
  })
  userSchema.statics.validateObj = (obj, config = {}) => {
    return userJoi.validate(obj, config)
  }
  userSchema.statics.validateUpdate = (obj) => {
    const updateJoi = joi.object({
      password: joi.string().min(1),
      username: joi.string()
    })
    return updateJoi.validate(obj, {})
  }
  return mongoose.model('UserCMS', userSchema)
}

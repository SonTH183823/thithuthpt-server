module.exports = (joi, mongoose, {
  joi2MongoSchema,
  schemas
}) => {
  const ObjectId = mongoose.Types.ObjectId
  const favoriteExamJoi = joi.object({
    examId: joi.string().required(),
    userId: joi.string().required()
  })
  const favoriteExamSchema = joi2MongoSchema(favoriteExamJoi, {
    userId: {
      type: ObjectId,
      ref: 'User'
    },
    examId: {
      type: ObjectId,
      ref: 'Exam'
    }
  }, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  favoriteExamSchema.statics.validateObj = (obj, config = {}) => {
    return favoriteExamJoi.validate(obj, config)
  }
  favoriteExamSchema.statics.validateDocument = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return favoriteExamJoi.validate(obj, config)
  }
  const examsQuestionsModel = mongoose.model('FavoriteExam', favoriteExamSchema)
  examsQuestionsModel.syncIndexes()
  return examsQuestionsModel
}

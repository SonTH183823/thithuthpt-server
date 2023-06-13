module.exports = (joi, mongoose, {
  joi2MongoSchema,
  schemas
}) => {
  const ObjectId = mongoose.Types.ObjectId
  const examJoi = joi.object({
    examId: joi.number(),
    questionId: joi.number()
  })
  const examQuestionSchema = joi2MongoSchema(examJoi, {
    slug: {
      type: String,
      unique: true
    },
    questionId: {
      type: ObjectId,
      ref: 'Question'
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
  examQuestionSchema.statics.validateObj = (obj, config = {}) => {
    return examJoi.validate(obj, config)
  }
  examQuestionSchema.statics.validateDocument = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return examJoi.validate(obj, config)
  }
  const examsQuestionsModel = mongoose.model('Exam', examQuestionSchema)
  examsQuestionsModel.syncIndexes()
  return examsQuestionsModel
}

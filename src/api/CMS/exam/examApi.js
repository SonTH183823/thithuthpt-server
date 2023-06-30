module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePathCMS } = serverSettings
  const { examController } = container.resolve('controller')
  const { verifyTokenCMS } = container.resolve('middleware')

  app.get(`${basePathCMS}/exam`, verifyTokenCMS, examController.getListExam)
  app.get(`${basePathCMS}/examToeic`, verifyTokenCMS, examController.getListToeic)
  app.get(`${basePathCMS}/exam/:id`, verifyTokenCMS, examController.getExamById)
  app.get(`${basePathCMS}/exam/question/:id`, verifyTokenCMS, examController.getListQuestionExam)
  app.get(`${basePathCMS}/examToeic/question/:id`, verifyTokenCMS, examController.getListQuestionExam)
  app.post(`${basePathCMS}/exam`, verifyTokenCMS, examController.createExam)
  app.put(`${basePathCMS}/exam/question/:id`, verifyTokenCMS, examController.updateQuestion)
  app.put(`${basePathCMS}/examToeic/question/:id`, verifyTokenCMS, examController.updateQuestionToeic)
  app.put(`${basePathCMS}/exam/:id`, verifyTokenCMS, examController.updateExamById)
  app.delete(`${basePathCMS}/exam/:id`, verifyTokenCMS, examController.removeExamById)
}

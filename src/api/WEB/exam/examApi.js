module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePath } = serverSettings
  const { examController } = container.resolve('controller')
  const { verifyToken } = container.resolve('middleware')

  app.get(`${basePath}/exam`, verifyToken, examController.getListExam)
  app.get(`${basePath}/totalExam`, verifyToken, examController.getTotalExam)
  app.get(`${basePath}/examToeic`, verifyToken, examController.getListToeic)
  app.get(`${basePath}/exam/question/:id`, verifyToken, examController.getListQuestionExam)
  app.get(`${basePath}/exam/related/:id`, verifyToken, examController.getExamRelated)
  app.get(`${basePath}/exam/:id`, verifyToken, examController.getExamById)
  app.put(`${basePath}/countTestView/:id`, verifyToken, examController.updateViewTestExam)
}

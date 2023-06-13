module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePathCMS } = serverSettings
  const { examController } = container.resolve('controller')
  const { verifyTokenCMS } = container.resolve('middleware')

  app.get(`${basePathCMS}/exam`, verifyTokenCMS, examController.getListExam)
  app.get(`${basePathCMS}/exam/:id`, verifyTokenCMS, examController.getExamById)
  app.post(`${basePathCMS}/exam`, verifyTokenCMS, examController.createExam)
  app.put(`${basePathCMS}/exam/:id`, verifyTokenCMS, examController.updateExamById)
  app.delete(`${basePathCMS}/exam/:id`, verifyTokenCMS, examController.removeExamById)
}
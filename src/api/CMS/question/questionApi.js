module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePathCMS } = serverSettings
  const { questionController } = container.resolve('controller')
  const { verifyTokenCMS } = container.resolve('middleware')

  app.get(`${basePathCMS}/question`, verifyTokenCMS, questionController.getListQuestion)
  app.get(`${basePathCMS}/question/:id`, verifyTokenCMS, questionController.getQuestionById)
  app.post(`${basePathCMS}/question`, verifyTokenCMS, questionController.createQuestion)
  app.put(`${basePathCMS}/question/:id`, verifyTokenCMS, questionController.updateQuestionById)
  app.delete(`${basePathCMS}/question/:id`, verifyTokenCMS, questionController.removeQuestionById)
}

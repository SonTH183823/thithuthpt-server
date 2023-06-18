module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePath } = serverSettings
  const { questionController } = container.resolve('controller')
  const { verifyToken } = container.resolve('middleware')

  app.get(`${basePath}/question`, verifyToken, questionController.getListQuestion)
  app.get(`${basePath}/question/:id`, verifyToken, questionController.getQuestionById)
}

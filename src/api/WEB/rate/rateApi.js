module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePath } = serverSettings
  const { rateController, ratePostController } = container.resolve('controller')
  const { verifyToken } = container.resolve('middleware')
  app.get(`${basePath}/rate`, verifyToken, rateController.getListRate)
  app.get(`${basePath}/rate/:id`, verifyToken, rateController.getRateById)
  app.post(`${basePath}/rate`, verifyToken, rateController.createRate)
  app.get(`${basePath}/ratePost/:id`, verifyToken, ratePostController.getRatePostById)
  app.put(`${basePath}/ratePost/:id`, verifyToken, ratePostController.updateRatePostById)
  app.post(`${basePath}/ratePost`, verifyToken, ratePostController.createRatePost)
}

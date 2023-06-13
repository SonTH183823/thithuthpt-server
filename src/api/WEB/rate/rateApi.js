module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePath } = serverSettings
  const { rateController } = container.resolve('controller')
  const { verifyToken } = container.resolve('middleware')
  app.get(`${basePath}/rate`, verifyToken, rateController.getListRate)
  app.get(`${basePath}/rate/:id`, verifyToken, rateController.getRateById)
  app.post(`${basePath}/rate`, verifyToken, rateController.createRate)
  app.delete(`${basePath}/rate/:id`, verifyToken, rateController.removeRateById)
  app.put(`${basePath}/rate/:id`, verifyToken, rateController.updateRateById)
}

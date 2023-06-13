module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePathCMS } = serverSettings
  const { rateController } = container.resolve('controller')
  const { verifyTokenCMS } = container.resolve('middleware')
  app.get(`${basePathCMS}/rate`, verifyTokenCMS, rateController.getListRate)
  app.get(`${basePathCMS}/rate/:id`, verifyTokenCMS, rateController.getRateById)
  app.post(`${basePathCMS}/rate`, verifyTokenCMS, rateController.createRate)
  app.delete(`${basePathCMS}/rate/:id`, verifyTokenCMS, rateController.removeRateById)
  app.put(`${basePathCMS}/rate/:id`, verifyTokenCMS, rateController.updateRateById)
}

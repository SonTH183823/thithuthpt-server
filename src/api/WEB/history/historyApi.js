module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePath } = serverSettings
  const { historyController } = container.resolve('controller')
  const { verifyToken } = container.resolve('middleware')

  app.get(`${basePath}/historyUser`, verifyToken, historyController.getListHistory)
  app.get(`${basePath}/totalHistory`, verifyToken, historyController.getTotalHistory)
  app.get(`${basePath}/historyToeic`, verifyToken, historyController.getListToeic)
  app.get(`${basePath}/history/:id`, verifyToken, historyController.getHistoryById)
}
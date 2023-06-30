module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePath } = serverSettings
  const { documentController } = container.resolve('controller')
  const { verifyToken } = container.resolve('middleware')

  app.get(`${basePath}/document`, verifyToken, documentController.getListDocument)
  app.get(`${basePath}/document/related/:id`, verifyToken, documentController.getDocumentRelated)
  app.get(`${basePath}/newestDocument`, verifyToken, documentController.getNewestDocument)
  app.get(`${basePath}/document/:id`, verifyToken, documentController.getDocumentById)
  app.put(`${basePath}/countViewDocument/:id`, verifyToken, documentController.updateViewTestDoc)
}

module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePathCMS } = serverSettings
  const { documentController } = container.resolve('controller')
  const { verifyTokenCMS } = container.resolve('middleware')

  app.get(`${basePathCMS}/document`, verifyTokenCMS, documentController.getListDocument)
  app.get(`${basePathCMS}/document/:id`, verifyTokenCMS, documentController.getDocumentById)
  app.post(`${basePathCMS}/document`, verifyTokenCMS, documentController.createDocument)
  app.put(`${basePathCMS}/document/:id`, verifyTokenCMS, documentController.updateDocumentById)
  app.delete(`${basePathCMS}/document/:id`, verifyTokenCMS, documentController.removeDocumentById)
}

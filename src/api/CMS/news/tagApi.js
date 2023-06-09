module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePathCMS } = serverSettings
  const { tagController } = container.resolve('controller')
  const { verifyTokenCMS } = container.resolve('middleware')
  app.get(`${basePathCMS}/tagNews`, verifyTokenCMS, tagController.getListTagNews)
  app.get(`${basePathCMS}/tagNews/:id`, verifyTokenCMS, tagController.getTagNewsById)
  app.post(`${basePathCMS}/tagNews`, verifyTokenCMS, tagController.createTag)
  app.put(`${basePathCMS}/tagNews/:id`, verifyTokenCMS, tagController.updateTagById)
  app.delete(`${basePathCMS}/tagNews/:id`, verifyTokenCMS, tagController.removeTagById)
}

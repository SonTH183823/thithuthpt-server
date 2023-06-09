module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePathCMS } = serverSettings
  const { categoryController } = container.resolve('controller')
  const { verifyTokenCMS } = container.resolve('middleware')
  app.get(`${basePathCMS}/cateNews`, verifyTokenCMS, categoryController.getListCateNews)
  app.get(`${basePathCMS}/cateNews/:id`, verifyTokenCMS, categoryController.getCateNewsById)
  app.post(`${basePathCMS}/cateNews`, verifyTokenCMS, categoryController.createCateNews)
  app.put(`${basePathCMS}/cateNews/:id`, verifyTokenCMS, categoryController.updateCateNewsById)
  app.delete(`${basePathCMS}/cateNews/:id`, verifyTokenCMS, categoryController.removeCateNewsById)
}

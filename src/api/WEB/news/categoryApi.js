module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePath } = serverSettings
  const { categoryController } = container.resolve('controller')
  const { verifyToken } = container.resolve('middleware')
  app.get(`${basePath}/cateNews`, verifyToken, categoryController.getListCateNews)
  app.get(`${basePath}/cateNews/:id`, verifyToken, categoryController.getCateNewsById)
}

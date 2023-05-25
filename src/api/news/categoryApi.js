module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePath } = serverSettings
  const { categoryController } = container.resolve('controller')

  app.get(`${basePath}/cateNews`, categoryController.getListCateNews)
  app.get(`${basePath}/cateNews/:id`, categoryController.getCateNewsById)
  app.post(`${basePath}/cateNews`, categoryController.createCateNews)
  app.put(`${basePath}/cateNews/:id`, categoryController.updateCateNewsById)
  app.delete(`${basePath}/cateNews/:id`, categoryController.removeCateNewsById)
}

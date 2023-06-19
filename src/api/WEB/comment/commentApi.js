module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePath } = serverSettings
  const { commentController } = container.resolve('controller')
  const { verifyToken } = container.resolve('middleware')
  app.get(`${basePath}/comment/:id`, verifyToken, commentController.getListComment)
  app.get(`${basePath}/comment/:id`, verifyToken, commentController.getCommentById)
  app.post(`${basePath}/comment`, verifyToken, commentController.createComment)
  app.delete(`${basePath}/comment/:id`, verifyToken, commentController.removeCommentById)
  app.put(`${basePath}/comment/:id`, verifyToken, commentController.updateCommentById)
}

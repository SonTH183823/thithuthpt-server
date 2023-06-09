module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePath } = serverSettings
  const { commentStatusController } = container.resolve('controller')
  const { verifyToken } = container.resolve('middleware')
  app.get(`${basePath}/commentStatus`, verifyToken, commentStatusController.getCommentStatusByListCommentIdAndUser)
  app.get(`${basePath}/commentStatus/:id`, verifyToken, commentStatusController.getCommentStatusById)
  app.post(`${basePath}/commentStatus`, verifyToken, commentStatusController.createCommentStatus)
  app.post(`${basePath}/delCommentStatus`, verifyToken, commentStatusController.delCommentStatusNotId)
  app.delete(`${basePath}/commentStatus/:id`, verifyToken, commentStatusController.removeCommentStatusById)
  app.put(`${basePath}/commentStatus/:id`, verifyToken, commentStatusController.updateCommentStatusById)
}

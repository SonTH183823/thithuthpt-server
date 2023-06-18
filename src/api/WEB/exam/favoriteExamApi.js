module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePath } = serverSettings
  const { favoriteExamController } = container.resolve('controller')
  const { verifyToken } = container.resolve('middleware')
  app.get(`${basePath}/favoriteExam`, verifyToken, favoriteExamController.getListFavoriteExams)
  app.get(`${basePath}/favoriteExam/:id`, verifyToken, favoriteExamController.getFavoriteExamById)
  app.post(`${basePath}/favoriteExam`, verifyToken, favoriteExamController.toggleFavorite)
  app.delete(`${basePath}/favoriteExam/:id`, verifyToken, favoriteExamController.removeFavoriteExamById)
  app.put(`${basePath}/favoriteExam/:id`, verifyToken, favoriteExamController.updateFavoriteExamById)
}

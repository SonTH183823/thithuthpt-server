module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePathCMS } = serverSettings
  const { favoriteExamController } = container.resolve('controller')
  const { verifyTokenCMS } = container.resolve('middleware')
  app.get(`${basePathCMS}/favoriteExam`, verifyTokenCMS, favoriteExamController.getListFavoriteExams)
  app.get(`${basePathCMS}/favoriteExam/:id`, verifyTokenCMS, favoriteExamController.getFavoriteExamById)
  app.post(`${basePathCMS}/favoriteExam`, verifyTokenCMS, favoriteExamController.createFavoriteExam)
  app.delete(`${basePathCMS}/favoriteExam/:id`, verifyTokenCMS, favoriteExamController.removeFavoriteExamById)
  app.put(`${basePathCMS}/favoriteExam/:id`, verifyTokenCMS, favoriteExamController.updateFavoriteExamById)
}

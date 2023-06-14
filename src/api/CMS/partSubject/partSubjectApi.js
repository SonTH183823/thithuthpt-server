module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePathCMS } = serverSettings
  const { partSubjectController } = container.resolve('controller')
  const { verifyTokenCMS } = container.resolve('middleware')

  app.get(`${basePathCMS}/partSubject`, verifyTokenCMS, partSubjectController.getListPartSubject)
  app.get(`${basePathCMS}/partSubject/:id`, verifyTokenCMS, partSubjectController.getPartSubjectById)
  app.post(`${basePathCMS}/partSubject`, verifyTokenCMS, partSubjectController.createPartSubject)
  app.put(`${basePathCMS}/partSubject/:id`, verifyTokenCMS, partSubjectController.updatePartSubjectById)
  app.delete(`${basePathCMS}/partSubject/:id`, verifyTokenCMS, partSubjectController.removePartSubjectById)
}

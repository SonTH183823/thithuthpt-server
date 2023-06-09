module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { userController } = container.resolve('controller')
  const { verifyTokenCMS } = container.resolve('middleware')
  const { basePathCMS } = serverSettings
  app.get(`${basePathCMS}/details`, verifyTokenCMS, userController.getUserDetail)
  app.get(`${basePathCMS}/users`, verifyTokenCMS, userController.getListUserByIds)
  app.delete(`${basePathCMS}/users/:id`, verifyTokenCMS, userController.deleteUserByUid)
  app.get(`${basePathCMS}/allUsers`, verifyTokenCMS, userController.getAllUserWebsite)
  app.put(`${basePathCMS}/user`, verifyTokenCMS, userController.updateSelfInfo)
  app.put(`${basePathCMS}/usersById/:id`, verifyTokenCMS, userController.updateUsersById)
}

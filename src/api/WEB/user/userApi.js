module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { userController } = container.resolve('controller')
  const { verifyToken } = container.resolve('middleware')
  const { basePath } = serverSettings

  app.post(`${basePath}/login`, userController.loginOrRegister)
  app.use(verifyToken)
  app.get(`${basePath}/ping`, userController.ping)
  app.get(`${basePath}/verifyToken`, userController.verifyToken)
  app.get(`${basePath}/details`, userController.getUserDetail)
  app.get(`${basePath}/user/:id`, userController.getUserById)
  app.post(`${basePath}/logout`, userController.logout)
  app.put(`${basePath}/user`, userController.updateSelfInfo)
  app.put(`${basePath}/usersById/:id`, userController.updateUsersById)
}

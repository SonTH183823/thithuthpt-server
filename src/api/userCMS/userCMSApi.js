module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { userCMSController } = container.resolve('controller')
  const { verifyAccessToken } = container.resolve('middleware')
  const { basePath } = serverSettings
  app.get(`${basePath}/userCMS`, verifyAccessToken, userCMSController.getUserCMS)
  app.get(`${basePath}/userCMSInfo`, userCMSController.getListUserCMSByIds)
  app.get(`${basePath}/userCMS/logout`, userCMSController.logout)
  app.post(`${basePath}/userCMS/login`, userCMSController.login)
  app.put(`${basePath}/userCMS/changePassword`, userCMSController.changePassword)
  app.put(`${basePath}/userCMS/updateSelfInfo`, userCMSController.updateSelfInfo)
  app.get(`${basePath}/userCMS/refreshToken`, userCMSController.refreshToken)
  app.get(`${basePath}/userCMS/check-exist/:id`, userCMSController.checkUserCMSId)
  app.get(`${basePath}/userCMS/:id`, userCMSController.getUserCMSById)
  app.put(`${basePath}/userCMS/:id`, verifyAccessToken, userCMSController.updateUserCMS)
  app.delete(`${basePath}/userCMS/:id`, verifyAccessToken, userCMSController.deleteUserCMS)
  app.post(`${basePath}/userCMS`, verifyAccessToken, userCMSController.addUserCMS)
}

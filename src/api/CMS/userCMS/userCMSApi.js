module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { userCMSController } = container.resolve('controller')
  const { verifyTokenCMS } = container.resolve('middleware')
  const { basePathCMS } = serverSettings
  app.get(`${basePathCMS}/userCMS`, verifyTokenCMS, userCMSController.getUserCMS)
  app.get(`${basePathCMS}/userCMSInfo`, verifyTokenCMS, userCMSController.getListUserCMSByIds)
  app.get(`${basePathCMS}/userCMS/logout`, verifyTokenCMS, userCMSController.logout)
  app.post(`${basePathCMS}/userCMS/login`, userCMSController.login)
  app.put(`${basePathCMS}/userCMS/changePassword`, verifyTokenCMS, userCMSController.changePassword)
  app.put(`${basePathCMS}/userCMS/updateSelfInfo`, verifyTokenCMS, userCMSController.updateSelfInfo)
  app.get(`${basePathCMS}/userCMS/refreshToken`, verifyTokenCMS, userCMSController.refreshToken)
  app.get(`${basePathCMS}/userCMS/check-exist/:id`, verifyTokenCMS, userCMSController.checkUserCMSId)
  app.get(`${basePathCMS}/userCMS/:id`, verifyTokenCMS, userCMSController.getUserCMSById)
  app.put(`${basePathCMS}/userCMS/:id`, verifyTokenCMS, verifyTokenCMS, userCMSController.updateUserCMS)
  app.delete(`${basePathCMS}/userCMS/:id`, verifyTokenCMS, verifyTokenCMS, userCMSController.deleteUserCMS)
  app.post(`${basePathCMS}/userCMS`, verifyTokenCMS, verifyTokenCMS, userCMSController.addUserCMS)
}

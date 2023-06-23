module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePath } = serverSettings
  const { notificationController } = container.resolve('controller')
  const { verifyToken } = container.resolve('middleware')
  app.get(`${basePath}/unViewed`, verifyToken, notificationController.getNumberNotificationUnViewed)
  app.get(`${basePath}/unViewedNotification`, verifyToken, notificationController.getNotificationUnViewed)
  app.post('/markRead/:id', verifyToken, notificationController.markNotificationRead)
  app.post('/markAllViewed', verifyToken, notificationController.markAllNotificationViewed)
}

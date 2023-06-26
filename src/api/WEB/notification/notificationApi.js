module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { basePath } = serverSettings
  const { notificationController } = container.resolve('controller')
  const { verifyToken } = container.resolve('middleware')
  app.get(`${basePath}/notification`, verifyToken, notificationController.getListNotification)
  app.get(`${basePath}/notification/unViewed`, verifyToken, notificationController.getNumberNotificationUnViewed)
  app.get(`${basePath}/notification/unViewedNotification`, verifyToken, notificationController.getNotificationUnViewed)
  app.post(`${basePath}/notification/markRead/:id`, verifyToken, notificationController.markNotificationRead)
  app.post(`${basePath}/notification/markAllViewed`, verifyToken, notificationController.markAllNotificationViewed)
}

module.exports = (container) => {
  const userController = require('./user/userController')(container)
  // news
  const newsController = require('./news/newsController')(container)
  const categoryController = require('./news/categoryController')(container)
  const tagController = require('./news/tagController')(container)
  // userCMS
  const userCMSController = require('./userCMS/userCMSController')(container)
  const authorizationController = require('./userCMS/authorizationController')(container)

  //rate
  const rateController = require('./rate/rateController')(container)
  const ratePostController = require('./ratePost/ratePostController')(container)

  //exam-question
  const examController = require('./exam/examController')(container)
  const questionController = require('./question/questionController')(container)
  const partSubjectController = require('./partSubject/partSubjectController')(container)
  const favoriteExamController = require('./exam/favoriteExamController')(container)

  //comment
  const commentController = require('./comment/commentController')(container)
  const commentStatusController = require('./comment/commentStatusController')(container)

  //document
  const documentController = require('./document/documentController')(container)

  //notification
  const notificationController = require('./notification/notificationController')(container)
  //history
  const historyController = require('./history/historyController')(container)
  return {
    userController,
    newsController,
    categoryController,
    tagController,
    userCMSController,
    authorizationController,
    rateController,
    examController,
    questionController,
    partSubjectController,
    favoriteExamController,
    commentController,
    commentStatusController,
    documentController,
    ratePostController,
    notificationController,
    historyController
  }
}

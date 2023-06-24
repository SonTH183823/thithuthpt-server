module.exports = (app, container) => {
  //CMS
  require('./CMS/userCMS/userCMSApi')(app, container)
  require('./CMS/user/userApi')(app, container)
  require('./CMS/news/categoryApi')(app, container)
  require('./CMS/news/tagApi')(app, container)
  require('./CMS/news/newsApi')(app, container)
  require('./CMS/rate/rateApi')(app, container)
  require('./CMS/partSubject/partSubjectApi')(app, container)

  //web
  require('./WEB/user/userApi')(app, container)
  require('./WEB/news/categoryApi')(app, container)
  require('./WEB/news/tagApi')(app, container)
  require('./WEB/news/newsApi')(app, container)
  require('./WEB/rate/rateApi')(app, container)
  require('./WEB/partSubject/partSubjectApi')(app, container)
  require('./WEB/notification/notificationApi')(app, container)
  require('./WEB/history/historyApi')(app, container)

  //upload
  require('./apiUpload')(app, container)

  //exam-question
  require('./CMS/exam/examApi')(app, container)
  require('./CMS/question/questionApi')(app, container)
  require('./WEB/exam/examApi')(app, container)
  require('./WEB/question/questionApi')(app, container)
  require('./WEB/exam/favoriteExamApi')(app, container)
  require('./CMS/exam/favoriteExamApi')(app, container)

  //comment
  require('./WEB/comment/commentApi')(app, container)
  require('./WEB/comment/commentStatusApi')(app, container)

  //document
  require('./WEB/document/documentApi')(app, container)
  require('./CMS/document/documentApi')(app, container)
}

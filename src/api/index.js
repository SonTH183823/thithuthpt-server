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

  //upload
  require('./apiUpload')(app, container)

  //exam-question
  require('./CMS/exam/examApi')(app, container)
  require('./CMS/question/questionApi')(app, container)
}

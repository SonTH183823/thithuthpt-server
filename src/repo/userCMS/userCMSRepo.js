module.exports = container => {
  const { schemas } = container.resolve('models')
  const { UserCMS } = schemas.mongoose
  const addUserCMS = (u) => {
    const user = new UserCMS(u)
    return user.save()
  }
  const login = ({
    username,
    password
  }) => {
    return UserCMS.findOne({
      username,
      password,
      activated: 1
    }).select('-password  -roles -groups')
  }
  const getUserCMSById = (id) => {
    return UserCMS.findById(id).populate({
      path: 'roles',
      populate: {
        path: 'permissions',
        populate: {
          path: 'resources'
        }
      }
    }).populate({
      path: 'groups',
      populate: {
        path: 'roles',
        populate: {
          path: 'permissions',
          populate: {
            path: 'resources'
          }
        }
      }
    }).select('-password')
  }
  const getUserCMSByUserCMSname = username => {
    return UserCMS.findOne({ username }).select('-password')
  }
  const deleteUserCMS = (id) => {
    return UserCMS.findByIdAndRemove(id, { useFindAndModify: false }).select('-password')
  }
  const updateUserCMS = (id, user) => {
    return UserCMS.findByIdAndUpdate(id, user, {
      useFindAndModify: false,
      returnOriginal: false
    }).select('-password')
  }
  const checkIdExist = (id) => {
    return UserCMS.findOne({ id }).select('-password')
  }
  const getUserCMSByCondition = async (pipe, limit, skip, sort = 1) => {
    const total = await UserCMS.countDocuments(pipe)
    const agg = [
      {
        $match: pipe
      },
      {
        $sort: { _id: +sort === -1 ? -1 : 1 }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      },
      {
        $project: {
          name: 1,
          userType: 1,
          username: 1,
          avatar: 1,
          roles: 1,
          groups: 1,
          owner: 1
        }
      }
    ]
    const data = await UserCMS.aggregate(agg)
    // const data = await UserCMS.find(pipe).limit(limit).skip(skip).sort({ _id: +sort ? 'desc' : 'asc' }).select('-password')
    return {
      total,
      data
    }
  }
  const getUserCMS = (pipe) => {
    return UserCMS.findOne(pipe)
  }
  const getUserCMSs = (pipe) => {
    return UserCMS.find(pipe)
  }
  const getListUserCMSByIds = async (ids) => {
    return await UserCMS.find({ _id: { $in: ids } }).select({ password: 0 })
  }
  return {
    getUserCMSByUserCMSname,
    getUserCMSByCondition,
    addUserCMS,
    getUserCMSById,
    deleteUserCMS,
    updateUserCMS,
    checkIdExist,
    login,
    getUserCMS,
    getUserCMSs,
    getListUserCMSByIds
  }
}

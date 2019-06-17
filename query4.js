function find_users(current_user_id, name_to_search_for){

  var cursor = db.users.aggregate([
  {$match: { _id: current_user_id}},
  {$lookup: {
    from: 'user_friends',
    localField: '_id',
    foreignField: '_id',
    as: 'friend'
  }},
  {$unwind: '$friend'},
  {$group: {
    _id: '$_id',
    friends: {$push: '$friend'}
  }},
  {$lookup: {
    from: 'user_friends',
    localField: 'friends.friend_id',
    foreignField: '_id',
    as: 'friend_friends'
  }},
  {$lookup: {
    from: 'users',
    localField: 'friends.friend_id',
    foreignField: '_id',
    as: 'friends'
  }},
  {$lookup: {
    from: 'users',
    let: {
      friend_friend_ids: "$friend_friends.friend_id",
      friend_ids: "$friends._id"
    },
    pipeline: [
      { $match: {
        $expr: { 
          $and: [
            { $in: [ "$_id", "$$friend_friend_ids" ] },
            { $not: [ { $in: [ "$_id", "$$friend_ids" ] } ] },
            { $gte: [ "$ps_search", 2 ] }
          ]
        }
      }}
    ],
    as: 'friend_friends'
  }},
  {$lookup: {
    from: 'users',
    let: {
    friend_friend_ids: "$friend_friends._id",
    friend_ids: "$friends._id"
  },
    pipeline: [
      { $match: {
        $expr: { 
          $and: [
            { $ne: [ "$_id", current_user_id ] },
            { $eq: [ "$ps_search", 3 ] },
            { $not: [ { $in: [ "$_id", "$$friend_ids" ] } ] },
            { $not: [ { $in: [ "$_id", "$$friend_friend_ids" ] } ] }
          ]
        }
      }}
    ],
    as: 'public_users'
  }},
  {$project: {
    friends: {
      $map:{
        input: "$friends",
        in: '$$this._id'
      }
    },
    friend_friends:{
      $map: {
        input: "$friend_friends",
        in: '$$this._id'
      }
    },
    public_users: {
      $map: {
        input: "$public_users",
        in: '$$this._id'
      }
    }
  }}])

  var visible_users = cursor.toArray()[0]
  var regex = new RegExp(name_to_search_for + ".*")

  var result = db.users.aggregate([{ 
    $match: {
      $expr: { 
        $or: [
          { $in: [ '$_id', visible_users.public_users ] },
          { $in: [ '$_id', visible_users.friends ] },
          { $in: [ '$_id', visible_users.friend_friends ] }
        ] 
      },
      name: { $regex: regex}
    }
  }])
  
  return result
}
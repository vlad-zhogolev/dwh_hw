function get_incoming_requests(user_id){
  //get incoming requests
  return db.friend_requests.aggregate([{$lookup: {
    from: 'users',
    localField: '_id',
    foreignField: '_id',
    as: 'follower'
  }
  },
  {$lookup: {
    from: 'users',
    localField: 'friend_id',
    foreignField: '_id',
    as: 'user'
  }
  },
  {$unwind: '$follower'},
  {$unwind: '$user'},
  {$project: {_id: 0, friend_id: 0}},
  {$match: {'user._id': user_id}}])
}

function get_outcoming_requests(user_id){
  //get outcoming requests
  db.friend_requests.aggregate([{$lookup: {
    from: 'users',
    localField: '_id',
    foreignField: '_id',
    as: 'follower'
  }
  },
  {$lookup: {
    from: 'users',
    localField: 'friend_id',
    foreignField: '_id',
    as: 'user'
  }
  },
  {$unwind: '$follower'},
  {$unwind: '$user'},
  {$project: {_id: 0, friend_id: 0}},
  {$match: {'follower._id': user_id}}])
}
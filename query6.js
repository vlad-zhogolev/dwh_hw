//get incoming requests
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
{$match: {'user.name': 'Darth Vader'}}])

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
{$match: {'follower.name': 'Darth Vader'}}])

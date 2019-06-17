fb_friend_ids = [3,2]
fb_id = 1
user_id = ObjectId('5d04e39f56cb9626a05e93f3')
db.users.updateMany(
    { fb_id: {$in: fb_friend_ids}},
    { $pull: { friends: { friend: user_id } }}
)

db.users.updateMany(
    { fb_id: {$in: fb_friend_ids}},
    { $push: { friends: { friend: user_id, fb: true } }}
)

fb_user_ids = db.users.distinct('_id' ,
    { fb_id: {$in: fb_friend_ids}}
)
db.users.updateOne(
    { _id: user_id},
    { $pull: { friends: { friend: {$in: fb_user_ids} } }}
)
db.users.updateOne(
    { _id: user_id},
    { $push: { friends: { $each: fb_user_ids.map(function(id) { return {friend: id, fb: true};}) } },
    $set: { fb_id: fb_id}
    }
)

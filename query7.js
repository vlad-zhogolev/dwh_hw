function create_friend_connections(user_id, fb_id, fb_friend_ids){
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
}

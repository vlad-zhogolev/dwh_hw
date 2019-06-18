function makeFriends(user_name_1, user_name_2){
	var friend_id = db.users.findOne({name : user_name_1})._id
	db.users.update({"name" : user_name_2}, {$addToSet : {friends : {friend : friend_id}}})
	friend_id = db.users.findOne({name : user_name_2})._id
	db.users.update({name : user_name_1}, {$addToSet : {friends : {friend : friend_id}}})
}

function addFlight(user_name, flight_number, cabin, seat){
	var flight_id = db.flights.findOne({flight_number : flight_number})._id
	if(flight_id)
		db.users.update({"name" : user_name}, {$addToSet : {flights : {"flight_id" : flight_id, "cabin" : cabin, "seat" : seat}}})
	else
		print("Flight: " + flight_number + " doesn't exist")
}

db.flights.drop();
db.users.drop();

db.createCollection("flights", {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: [
        'flight_number',
        'carrier',
        'origin',
        'destination',
        'departure',
        'arrival',
        'duration'
      ],
      properties: {
        flight_number: {
          bsonType: 'string'
        },
        carrier: {
          bsonType: 'string'
        },
        origin: {
          bsonType: 'string'
        },
        destination: {
          bsonType: 'string'
        },
        departure: {
          bsonType: 'date'
        },
        arrival: {
          bsonType: 'date'
        },
        duration: {
          bsonType: 'int',
          minimum: NumberInt(0)
        }
      }
    } 
  }
});

db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: [
        'name'
      ],
      properties: {
        fb_id: {
          bsonType: 'int',
          description: 'facebook id, must be integer'
        },
        name: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        friends: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            properties: {
              friend: {
                bsonType: 'objectId'
              },
              fb: {
                bsonType: 'bool'
              }
            }
          }
        },
        flights: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            properties: {
              flight_id: {
                bsonType: 'objectId'
              },
              cabin: {
                'enum': [
                  'e',
                  'pe',
                  'b',
                  'f'
                ],
                description: 'e = economy, pe = premium economy, b = business, f = first'
              },
              seat: {
                bsonType: 'string'
              }
            }
          }
        },
        status: {
          bsonType: 'string',
          description: 'must be a string'
        },
        ps_search: {
          'enum': [
            1,
            2,
            3
          ],
          description: 'visibility setting must be an int in range [1, 3]'
        },
        ps_nearby: {
          'enum': [
            0,
            1,
            2,
            3
          ],
          description: 'visibility setting must be an int in range [0, 3]'
        }
      }
    }
  }
});

db.flights.insertMany([ 
	{ flight_number: "BA 133", carrier: "BA", origin: "CDG", destination: "LHR", departure: new ISODate("2019-06-11T03:30:00Z"), arrival: new ISODate("2019-06-11T07:40:00Z"), duration: NumberInt(7200)}, 
	{ flight_number: "UA 177", carrier: "UA", origin: "LAX", destination: "JFK", departure: new ISODate("2019-09-11T03:30:00Z"), arrival: new ISODate("2019-09-11T07:40:00Z"), duration: NumberInt(9800)},
	{ flight_number: "UA 166", carrier: "RU", origin: "LAX", destination: "JFK", departure: new ISODate("2019-11-11T03:30:00Z"), arrival: new ISODate("2019-12-11T07:40:00Z"), duration: NumberInt(12000)}  
]);

var names = [ 
	"Vasya Pupkin", 
	"Roy Batty", 
	"Darth Vader", 
	"John Wick",
	"Blondie aka Man with No Name",
  "James McAvoy",
  "Michael Fassbender"
]

var statuses = [ 
	"Some silly phrase", 
	"All those moments will be lost in time, like tears in rain.", 
	"I'am your father", 
	"Fortes fortuna adiuvat.",
	"You see, in this world there's two kinds of people, my friend: Those with loaded guns and those who dig. You dig.",
  "A story about my life would be utterly dull.",
  "Lean on sardines, dudes. They say there is calcium."
]

db.users.insertMany([{ 
  fb_id : NumberInt(1),
  name : names[0],
  flights : [],
  friends : [],
  status : statuses[0],
  ps_search : NumberInt(3),
  ps_nearby : NumberInt(0)
 }, { 
  fb_id : NumberInt(2),
  name : names[1],
  flights : [],
  friends : [],
  status : statuses[1],
  ps_search : NumberInt(3),
  ps_nearby : NumberInt(0)
  }, { 
  fb_id : NumberInt(3),
  name : names[2],
  flights : [],
  friends : [],
  status : statuses[2],
  ps_search : NumberInt(3),
  ps_nearby : NumberInt(0)
  }, { 
  fb_id : NumberInt(4),
  name : names[3],
  flights : [],
  friends : [],
  status : statuses[3],
  ps_search : NumberInt(3),
  ps_nearby : NumberInt(0)
  }, { 
  fb_id : NumberInt(5),
  name : names[4],
  flights : [],
  friends : [],
  status : statuses[4],
  ps_search : NumberInt(1),
  ps_nearby : NumberInt(0)
}, { 
  fb_id : NumberInt(6),
  name : names[5],
  flights : [],
  friends : [],
  status : statuses[5],
  ps_search : NumberInt(2),
  ps_nearby : NumberInt(0)
}, { 
  fb_id : NumberInt(7),
  name : names[6],
  flights : [],
  friends : [],
  status : statuses[6],
  ps_search : NumberInt(2),
  ps_nearby : NumberInt(0)
}]);



addFlight(names[0], "BA 133", "e", "16c")
addFlight(names[0], "UA 177", "pe", "9a")

addFlight(names[1], "BA 133", "e",  "15c")

addFlight(names[2], "BA 133", "e", "14c")

addFlight(names[3], "UA 166", "b", "9d")

addFlight(names[4], "UA 166", "f", "4a")

addFlight(names[5], "BA 133", "e", "17c")

addFlight(names[6], "UA 177", "e", "18e")


makeFriends(names[0], names[1])
//makeFriends(names[1], names[4])
makeFriends(names[1], names[2])
makeFriends(names[1], names[3])
makeFriends(names[2], names[3])
makeFriends(names[3], names[4])
makeFriends(names[4], names[5])
makeFriends(names[4], names[6])
makeFriends(names[5], names[6])

db.createView("leader_board","users",[{
  $unwind : {
      path: "$flights" ,
      preserveNullAndEmptyArrays: true
    }
},{
  $lookup:{
    from : "flights",
    localField : "flights.flight_id",
    foreignField : "_id",
    as : "flight_info"
  }
},{
  $unwind : {
      path: "$flight_info",
      preserveNullAndEmptyArrays: true
    }
},{
  $group : {
    _id : "$_id",
    duration: { $sum: "$flight_info.duration" },
    name: { $first: "$name" }
  }
},{
  $sort: {duration: -1}
}
])

db.createView("friends","users",[{
  $unwind : "$friends"
},
{$project: {
friend_id: "$friends.friend"
}}])

db.createView("user_friends","friends",[{
    $lookup:
        {
          from: 'friends',
          localField: 'friend_id',
          foreignField: '_id',
          as: "RightTableData"
        }
},  
{$unwind :"$RightTableData" },
{ 
     $project: { 
     friend_id: 1,
            mutual: { $cond: [ { $eq: [ '$_id', '$RightTableData.friend_id' ] }, 1, 0 ] } 
        } 
},
{$match : { mutual: 1}}])

db.createView("friend_requests","friends",[{
    $lookup:
        {
          from: 'friends',
          localField: 'friend_id',
          foreignField: '_id',
          as: "RightTableData"
        }
},  
{$unwind : {
  path: "$RightTableData",
  preserveNullAndEmptyArrays: true
} },
{ 
     $project: { 
     friend_id: 1,
            mutual: { $cond: [ {$and: [
            { $eq: [ '$_id', '$RightTableData.friend_id' ] }, 
            { $eq: [ '$friend_id', '$RightTableData._id' ] }
            ]
            }, 1, 0 ] } 
        } 
},
{
$group: {
_id: {
user_id: '$_id', friend_id: '$friend_id'},
mutual: {
        $max: '$mutual'
    }
}
},
{$match: {mutual: 0}},
{$project: {_id: '$_id.user_id', friend_id: '$_id.friend_id'}}])

user = db.users.findOne({name: names[0]})
friend_ids = user.friends.map(function(f) { return f.friend; })
friends = db.users.find({'_id':{'$in': friend_ids}, 'friends.friend': user._id}, {_id: 1}).toArray().map(function(f) { return f._id; })


var flights = db.flights.find()
var users = db.users.find()
var leader_board = db.leader_board.find()

var path_to_queries = "/data/db/my_queries/query"
load(path_to_queries + "1.js")
load(path_to_queries + "2.js")
load(path_to_queries + "3.js")
load(path_to_queries + "4.js")
load(path_to_queries + "5.js")
load(path_to_queries + "6.js")
load(path_to_queries + "7.js")
load(path_to_queries + "8.js")
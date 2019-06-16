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
        'arrival'
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
	{ flight_number: "BA 133", carrier: "BA", origin: "CDG", destination: "LHR", departure: new ISODate("2019-06-11T03:30:00Z"), arrival: new ISODate("2019-06-11T07:40:00Z")}, 
	{ flight_number: "UA 177", carrier: "UA", origin: "LAX", destination: "JFK", departure: new ISODate("2019-09-11T03:30:00Z"), arrival: new ISODate("2019-09-11T07:40:00Z")},
	{ flight_number: "UA 166", carrier: "RU", origin: "LAX", destination: "JFK", departure: new ISODate("2019-11-11T03:30:00Z"), arrival: new ISODate("2019-12-11T07:40:00Z")}  
]);

var names = [ 
	"Vasya Pupkin", 
	"Roy Batty", 
	"Darth Vader", 
	"John Wick",
	"Blondie aka Man with No Name"
]

var statuses = [ 
	"Some silly phrase", 
	"All those moments will be lost in time, like tears in rain.", 
	"I'am your father", 
	"Fortes fortuna adiuvat.",
	"You see, in this world there's two kinds of people, my friend: Those with loaded guns and those who dig. You dig."
]

db.users.insertMany([{ 
  fb_id : NumberInt(1),
  name : names[0],
  flights : [{cabin : "e", seat : "16c"}, {cabin : "pe", seat : "8b"}],
  friends : [],
  status : statuses[0],
  ps_search : NumberInt(3),
  ps_nearby : NumberInt(0)
 }, { 
  fb_id : NumberInt(2),
  name : names[1],
  flights : [{cabin : "e", seat : "15c"}],
  friends : [],
  status : statuses[1],
  ps_search : NumberInt(3),
  ps_nearby : NumberInt(0)
  }, { 
  fb_id : NumberInt(3),
  name : names[2],
  flights : [{cabin : "e", seat : "14c"}],
  friends : [],
  status : statuses[2],
  ps_search : NumberInt(3),
  ps_nearby : NumberInt(0)
  }, { 
  fb_id : NumberInt(4),
  name : names[3],
  flights : [{cabin : "e", seat : "13c"}],
  friends : [],
  status : statuses[3],
  ps_search : NumberInt(3),
  ps_nearby : NumberInt(0)
  }, { 
  fb_id : NumberInt(5),
  name : names[4],
  flights : [{cabin : "e", seat : "12c"}],
  friends : [],
  status : statuses[4],
  ps_search : NumberInt(3),
  ps_nearby : NumberInt(0)
}]);



addFlight(names[0], "BA 133", "e", "16c")
addFlight(names[0], "UA 177", "pe", "9a")

addFlight(names[1], "BA 133", "e",  "15c")

addFlight(names[2], "BA 133", "e", "14c")

addFlight(names[3], "UA 166", "b", "9d")

addFlight(names[4], "UA 166", "f", "4a")


makeFriends(names[0], names[1])
makeFriends(names[0], names[4])
makeFriends(names[1], names[2])
makeFriends(names[1], names[3])
makeFriends(names[2], names[3])
makeFriends(names[3], names[4])


var flights = db.flights.find()
var users = db.users.find()
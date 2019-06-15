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

db.users.insertMany([{ 
  fb_id : NumberInt(1),
  name : "Vasya Pupkin",
  flights : [{cabin : "e", seat : "16c"}, {cabin : "pe", seat : "8b"}],
  friends : [],
  status : "Some silly phrase",
  ps_search : NumberInt(3),
  ps_nearby : NumberInt(0)
 }, { 
  fb_id : NumberInt(2),
  name : "Evgeniy Bazarov",
  flights : [{cabin : "e", seat : "15c"}],
  friends : [],
  status : "Some silly phrase",
  ps_search : NumberInt(3),
  ps_nearby : NumberInt(0)
  }, { 
  fb_id : NumberInt(3),
  name : "Andrew Chatsky",
  flights : [{cabin : "e", seat : "14c"}],
  friends : [],
  status : "Some silly phrase",
  ps_search : NumberInt(3),
  ps_nearby : NumberInt(0)
}]);

var flight_id = db.flights.findOne({flight_number : "BA 133"})._id
db.users.updateOne({"name" : "Vasya Pupkin"}, {$set : {"flights.0.flight_id" : flight_id}})

flight_id = db.flights.findOne({flight_number : "UA 177"})._id
db.users.updateOne({"name" : "Vasya Pupkin"}, {$set : {"flights.1.flight_id" : flight_id}})

flight_id = db.flights.findOne({flight_number : "BA 133"})._id
db.users.updateOne({"name" : "Evgeniy Bazarov"}, {$set : {"flights.0.flight_id" : flight_id}})

flight_id = db.flights.findOne({flight_number : "BA 133"})._id
db.users.updateOne({"name" : "Andrew Chatsky"}, {$set : {"flights.0.flight_id" : flight_id}})

var friend_id = db.users.findOne({name : "Vasya Pupkin"})._id
db.users.update({"name" : "Evgeniy Bazarov"}, {$push : {friends : {friend : friend_id}}})
friend_id = db.users.findOne({name : "Evgeniy Bazarov"})._id
db.users.update({"name" : "Vasya Pupkin"   }, {$push : {friends : {friend : friend_id}}})

var flights = db.flights.find()
var users = db.users.find()
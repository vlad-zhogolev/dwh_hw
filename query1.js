function add_flight(primary_info, additional_info){
  flight_id = db.flights.findAndModify({
    query: primary_info,
    update: {
      $setOnInsert: additional_info
    },
    new: true,   // return new doc if one is upserted
    upsert: true // insert the document if it does not exist
  })._id

  user_id = ObjectId("5d04e73ae610cf26a0a11cee")

  db.users.updateOne(
    { _id: user_id },
    {
      $push: {
        flights: {
           flight_id: flight_id,
           seat: '37A',
           cabin: 'e'
        }
      }
    }
  )
}

function add_example_flight(){
  var added_flight = {
    primary_info: { flight_number: "BA 137", departure: new ISODate("2019-06-11T03:30:00Z"), arrival: new ISODate("2019-06-11T07:40:00Z"), duration: NumberInt(5500)  },
    additional_info: {  carrier: "BA", origin: "BCN", destination: "LHR"}
  }
  add_flight(added_flight.primary_info, added_flight.additional_info)
}
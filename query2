db.users.aggregate([{
		$unwind: "$flights"
	}, {
		$lookup:{
			from : "flights",
			localField : "flights.flight_id",
			foreignField : "_id",
			as : "users_flights"
		}
	},{
		$unwind: "$users_flights"
	},{
		$match : {
			"users_flights.departure" : {$gte : new Date()}
		}
	},{
		$project : {
			"_id" : 0,
			"cabin" : "$flights.cabin",
			"seat"  : "$flights.seat",
			"duration" : "$flights.duration",
			"flight_number" : "$users_flights.flight_number",
			"carrier" : "$users_flights.carrier",
			"origin" : "$users_flights.origin",
			"destination" : "$users_flights.destination",
			"departure" : "$users_flights.departure",
			"arrival" : "$users_flights.arrival"
		}
	}
])
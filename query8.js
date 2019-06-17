// Create a collection with info about flights origins
// Contains total duration of all flights from specific city, number of flights, average duration of flight

var mapFlightsToOrigin = function() {
	var key = this.origin;
	var flightDuration = this.duration;

	var value = { totalDuration: flightDuration, flightsNumber: 1 }
	emit(key, value);
	
};

var reduceOriginFlightsDuration = function(flightOrigin, values) {
	var durationsSum = Array.sum(values.map(function(value) { return value.totalDuration }));
	var durationsLength = values.length;

	reducedVal = {};

	reducedVal.totalDuration =  durationsSum;
	reducedVal.flightsNumber = durationsLength;
	
	return reducedVal;
};

var finalizeFlightsOriginInfo = function(key, reducedVal) {
	reducedVal.averageDuration = reducedVal.totalDuration / reducedVal.flightsNumber;

	return reducedVal;
}


db.flights.mapReduce(
	mapFlightsToOrigin,
	reduceOriginFlightsDuration,
	{
		finalize: finalizeFlightsOriginInfo,
		out: "origin_flights_info",
	}
)
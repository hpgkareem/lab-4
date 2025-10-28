const {trips} = require('../models/Tripmodel.js');


const retrieveAllTrips = (req, res) => {
    const allTrips = getTripswithdailycost();
    res.status(200).json({
        status: 'success',
        message: 'Trips retrieved successsfully',
        results: allTrips.length,
        data: allTrips,
    });
};

const createtrip =(req,res) => {
    const {
        destinationName,
        location,
        continent,
        language,
        description,
        flightCost,
        accommodationCost,
        mealCost,
        visaCost,
        transportationCost,
        currencyCode,}=req.body;


const newTrip=
{
id:trips.length+1,
destinationName,
        location,
        continent,
        language,
        description,
        flightCost,
        accommodationCost,
        mealCost,
        visaCost,
        transportationCost,
        currencyCode,

}
trips.push(newTrip);

}

const deleteTripById=(req,res)=>{
    const id=Number(req.params.id);
    const index=trips.findIndex(t=>t.id==id);
    trips.slice(index,1);
    res.status(200).json({
        status:'success',
        message:'Trip deleted successfully'
    });
}

module.exports
{retrieveAllTrips,createTrip,deleteTripById};

const { db } = require('../db.js');


const query = `
    INSERT INTO TRIP (
        DESTINATIONNAME, LOCATION, CONTINENT, LANGUAGE, DESCRIPTION, 
        FLIGHTCOST, ACCOMMODATIONCOST, MEALCOST, VISACOST, TRANSPORTATIONCOST, CURRENCYCODE
    ) 
     
        
    VALUES ('${destinationName}', '${location}', '${continent}', '${language}',
      '${description}','${flightCost}','${accommodationCost}','${mealcost}', 
      '${visacost}','${transportationCost}','${currencycode}'
    )
    `;

    db.run(query, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Database error',
                error: err.message
            });
        };
   
        return res.status(201).json({
            message: 'Trip created successfully'
        });
    });

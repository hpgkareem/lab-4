// Simple mock trip data
const trips = [
    {
      id: 1,
      destinationName: 'Paris',
      location: 'France',
      continent: 'Europe',
      language: 'French',
      description: 'Romantic city known for art, cuisine, and the Eiffel Tower.',
      flightCost: 400,
      accommodationCost: 150,
      mealCost: 80,
      visaCost: 50,
      transportationCost: 30,
      currencyCode: 'EUR',
    },
    {
      id: 2,
      destinationName: 'Tokyo',
      location: 'Japan',
      continent: 'Asia',
      language: 'Japanese',
      description: 'A vibrant metropolis blending ancient culture and modern innovation.',
      flightCost: 800,
      accommodationCost: 200,
      mealCost: 90,
      visaCost: 0,
      transportationCost: 40,
      currencyCode: 'JPY',
    },
    {
      id: 3,
      destinationName: 'Cairo',
      location: 'Egypt',
      continent: 'Africa',
      language: 'Arabic',
      description: 'Historic capital famous for the Pyramids of Giza and the Nile River.',
      flightCost: 150,
      accommodationCost: 100,
      mealCost: 50,
      visaCost: 25,
      transportationCost: 20,
      currencyCode: 'EGP',
    },
    {
      id: 4,
      destinationName: 'New York',
      location: 'United States',
      continent: 'North America',
      language: 'English',
      description: 'The city that never sleeps, known for its skyline and cultural diversity.',
      flightCost: 600,
      accommodationCost: 250,
      mealCost: 120,
      visaCost: 100,
      transportationCost: 50,
      currencyCode: 'USD',
    },
    {
      id: 5,
      destinationName: 'Sydney',
      location: 'Australia',
      continent: 'Australia',
      language: 'English',
      description: 'Beautiful coastal city with beaches, the Opera House, and vibrant nightlife.',
      flightCost: 900,
      accommodationCost: 180,
      mealCost: 70,
      visaCost: 60,
      transportationCost: 35,
      currencyCode: 'AUD',
    },
    {
      id: 6,
      destinationName: 'Rio de Janeiro',
      location: 'Brazil',
      continent: 'South America',
      language: 'Portuguese',
      description: 'Famous for its beaches, Carnival festival, and Christ the Redeemer statue.',
      flightCost: 700,
      accommodationCost: 120,
      mealCost: 60,
      visaCost: 40,
      transportationCost: 25,
      currencyCode: 'BRL',
    },
    {
      id: 7,
      destinationName: 'Rome',
      location: 'Italy',
      continent: 'Europe',
      language: 'Italian',
      description: 'Ancient city rich in history, architecture, and Italian cuisine.',
      flightCost: 350,
      accommodationCost: 130,
      mealCost: 75,
      visaCost: 50,
      transportationCost: 30,
      currencyCode: 'EUR',
    },
  ];
  
  // Function to calculate daily cost for each trip
  function getTripsWithDailyCost() {
    for (let i = 0; i < trips.length; i++) {
      const t = trips[i];
      t.dailyCost =
        t.flightCost +
        t.accommodationCost +
        t.mealCost +
        t.visaCost +
        t.transportationCost;
    }
    return trips;
  }
  
  module.exports = { trips };
  
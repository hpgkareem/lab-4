const { app } = require('./index.js');
// added db initialization to server
const db_access = require('./db.js');
const db = db_access.db;

const PORT = 3000;

// Initialize database tables
db.serialize(() => {
  db.run(db_access.createTripTable, (err) => {
    if (err) console.log('Error creating Appointment table:', err.message);
  });
  db.run(db_access.createUserTable, (err) => {
    if (err) console.log('Error creating user table:', err.message);
  });
  db.run(db_access.createVisitTable, (err) => {
    if (err) console.log('Error creating Visit table:', err.message );
  });
  db.run(db_access.createAuthLogTable, (err) => {
    if (err) console.log('Error creating AuthLog table:', err.message);
  });
});

// Start listening on the specified port
app.listen(PORT, () => {
  console.log(` hospital Server is running on port ${PORT}`);
});
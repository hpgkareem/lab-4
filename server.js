const {app} = require('/index.js');

// added db initialization to server

const db_access = require('./db.js');
const db = db_access. db;

const PORT = 3000;

// Initialize database tables
db. serialize(() => {
    db.run(db_access.createTripTable, (err) => {
      if (err) console.log('Error creating trip table:', err.message);
    });

    db.run(db_access.createUserTable, (err) => {
      if (err) console.log('Error creating trip table:', err.message);
    });
});

const { app } = require('./index.js');
const db_access = require('./models/db.js');
const db = db_access.db;

const PORT = 3000;

db.serialize(() => {
    db.run(db_access.createUserTable, (err) => {
        if (err) console.error('Error creating User table:', err.message);
    });

    db.run(db_access.createAppointmentTable, (err) => {
        if (err) console.error('Error creating Appointment table:', err.message);
    });

    db.run(db_access.createVisitTable, (err) => {
        if (err) console.error('Error creating Visit table:', err.message);
    });

    db.run(db_access.createAuthLogTable, (err) => {
        if (err) console.error('Error creating AuthLog table:', err.message);
    });
});

// Start listening on the specified port
app.listen(PORT, () => {
    console.log(`Hospital Server is running on port ${PORT}`);
});
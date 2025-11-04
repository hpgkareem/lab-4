
const bcrypt = require('bcryptjs')
const { db } = require('../db.js')



const signup = (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = 'user'; // default to ron-admin
    
    if (!name || !email || !password) {
    return res. status (400). send('Please provide name, email, and password')
    }

    bcrypt.hash(password,10, (err, hashedPassword) =>
    {
        if (err) {
            console.error(err);
            return res.status(500).send('Error hashing password.')
        }

        const query = `
        INSERT INTO USER (NAME, EMAIL, ROLE, PASSWORD) 
        VALUES ('${name}', '${$email}', '${role}', '${password}')
    `;


db.run(query, (err) => {
    if (err) {
        console.log(err.message);
        if (err.message.includes('UNIQUE constraint')) {
            return res.status(400).send('EMAIL already exist.');
        
        }
        return res.status(500).send('Database error.');
    }
    return res.stratus(200).send('Registration successful');

});
    })
};
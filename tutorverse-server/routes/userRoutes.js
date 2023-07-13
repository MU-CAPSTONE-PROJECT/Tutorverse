const express = require('express');
const bcrypt = require ('bcrypt');
const bodyParser = require('body-parser')
const { User } = require ('../data.js');

const router = express.Router();

// create application/json parser
const jsonParser = bodyParser.json()

//Endpoint to send new user data from signup
router.post('/signup', async (req, res)  => {
    console.log(req.body);
    const { userId, firstName, lastName, emailAddress, password , userRole, school } = req.body;
    console.log(firstName);
  try {

    // Check if email already exists
    const existingUser = await User.findOne({
        where: { emailAddress }
        
    });

    if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
    }
    
    //Password Encryption
    const hashedPassword = await bcrypt.hash(password, 10);
    
    //Create new user
    const newUser = await User.create({id:userId, firstName, lastName, emailAddress, password: hashedPassword , userRole, school});

    //Create session
    req.session.user = newUser;
    // req.session.save();

    return res.status(201).json({ message: 'User created successfully', newUser});

    
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: 'Failed to create user' });
  }
})

//Endpoint to handle login
router.post('/login', jsonParser, async  function (req, res) {
    console.log(req.params);
    try{
        const { emailAddress, password } = req.body;
        
        // Find the user with the provided email
        const user = await User.findOne({ where: { emailAddress }});

        if (user===null) {
          return res.status(404).json({ error: 'User not found.' });
        }

        // Validate the password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid username or password' });
        }

        //set cookie
        req.session.user = user;
        // req.session.save();
        console.log("Cookie set")
        return res.status(200).json({ message: 'User logged in successfully!', user });
        

    } catch (error){
        console.error('Error:', error);
        return res.status(500).json({ error: 'Something went wrong!'})
    }
}) 

module.exports = router;

const router = require('express').Router();
const User = require('../models/user');
const {registerValidation, loginValidation} = require('../validation')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//Register Route
router.post('/register',async(req,res)=>{

    //Validation of data
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Check if user already exists
    const emaiExists = await User.findOne({email: req.body.email});
    if(emaiExists) return res.status(400).send('Email already exists');

    //Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.status(201).send(savedUser);
    }
    catch(err){
        res.status(500).send(err)
    }
});


//Login Route
router.post('/login', async(req,res)=>{

    //Login Validation
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if email exists
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email incorrect');

    //Checking if password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Password incorrect');

    //Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);
    res.status(200).send('Logged In');
});


module.exports = router;

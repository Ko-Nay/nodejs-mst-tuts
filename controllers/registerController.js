const bcrypt = require('bcrypt');
const User = require('../models/User');

const handleNewRegister = async (req,res) =>{
    const { user, pwd } = req.body
    if(!user || !pwd ) return res.status(400).json({ 'message' : 'User and Password are required!'});

    const duplicate = await User.findOne({ username : user }).exec();
    if(duplicate) return res.sendStatus(409);

    try{
        //hash the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        //create and store the new user in to the db        
        const result = await User.create({ 
            "username" : user,
            "password" : hashedPwd 
        });

        console.log('New User : ', result);
        res.status(201).json({ 'success' : `New user ${user} is created`})
    } catch (err) {
        res.status(500).json({ 'error' : err.message})
    }
};

module.exports = {handleNewRegister};
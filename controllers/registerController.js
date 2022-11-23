const bcrypt = require('bcrypt');
const fsPromises = require('fs').promises;
const path = require('path');

const userDB = {
    users : require('../models/users'),
    setUsers : function (data) { this.users = data }
}


const handleNewRegister = async (req,res) =>{
    const { user, pwd } = req.body
    if(!user || !pwd ) return res.status(400).json({ 'message' : 'User and Password are required!'});

    const duplicate = userDB.users.find( person => person.username === user);
    // if(duplicate) return res.sendStatus(409)
    if(duplicate) return res.status(409).json({"message" : 'User alread existed'});

    try{
        //hash the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        //store the new user in to the db
        const newUser = { "username" : user, "password" : hashedPwd }
        userDB.setUsers([...userDB.users, newUser])

        //actual inserting data to the db
        await fsPromises.writeFile(
            path.join(__dirname,'..', 'models', 'users.json'),
            JSON.stringify(userDB.users)
        )

        console.log(userDB.users);
        res.status(201).json({ 'success' : `New user ${user} is created`})

    } catch (err) {
        res.status(500).json({ 'error' : err.message})
    }
}

module.exports = {handleNewRegister};
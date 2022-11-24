const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path')

const userDB = {
    users : require('../models/users'),
    setUsers : function (data) { this.users = data }
};


const handleLogin = async ( req, res ) => {
    const { user, pwd } = req.body;
    if(!user || !pwd ) return res.status(400).json({ "message" : "Username and Password are required"});

    const foundUser = userDB.users.find( person => person.username === user );
    console.log(foundUser);
    if(!foundUser) return res.sendStatus(401);

    const match = await bcrypt.compare(pwd, foundUser.password);

    if(match){

        //giving access and refers tokens to the found user

        const accessToken = jwt.sign(
            { "username" : foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn : '30s'},
        );

        const refreshToken = jwt.sign(
            { "username" : foundUser.username },
            process.env.REFRES_TOKEN_SECRET, 
            { expiresIn : '1d' }
        );

        //saving the refreshToken of foundUser and the other users into the database
        const otherUsers = userDB.users.filter( person => person.username !== foundUser.username );
        const currentUser = { ...foundUser, refreshToken};
        userDB.setUsers([ ...otherUsers, currentUser ]);

        await fsPromises.writeFile(
            path.join(__dirname, '..', 'models','users.json'),
            JSON.stringify(userDB.users)
        );
        
        //saving token on httpOnly cookie for better secure
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge : 24 * 60 * 60 * 1000 });
        
        //for front-end
        res.json({accessToken});
    }else{
        res.status(400).json({'err' : 'Password does not match'})
    }

}

module.exports = { handleLogin };
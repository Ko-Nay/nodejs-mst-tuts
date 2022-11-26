const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const handleLogin = async ( req, res ) => {
    const { user, pwd } = req.body;
    if(!user || !pwd ) return res.status(400).json({ "message" : "Username and Password are required"});

    const foundUser = await User.findOne({ username : user }).exec();
    if(!foundUser) return res.sendStatus(401);

    const match = await bcrypt.compare(pwd, foundUser.password);

    if(match){

        const roles = Object.values(foundUser.roles);
        if(!roles) return res.sendStatus(401);

        //giving access and refers tokens to the found user

        const accessToken = jwt.sign(
            { 
                "UserInfo" : {
                    "username" : foundUser.username,
                    "roles" : roles,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn : '3m'},
        );

        const refreshToken = jwt.sign(
            { "username" : foundUser.username },
            process.env.REFRES_TOKEN_SECRET, 
            { expiresIn : '1d' }
        );

        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);
        
        //saving token on httpOnly cookie for better secure
        res.cookie('jwt', refreshToken, { httpOnly: true,  maxAge : 24 * 60 * 60 * 1000 });
        
        //for front-end
        res.json({accessToken});
    }else{
        res.status(400).json({'err' : 'Password does not match'})
    }

}

module.exports = { handleLogin };
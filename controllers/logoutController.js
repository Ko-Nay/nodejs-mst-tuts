const User = require('../models/User');

const handleLogout = async ( req, res ) =>{
    const cookies = req.cookies
    // if( !cookies?.jwt ) return res.sendStatus(401);
    if( ! cookies && cookies.jwt ) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    //Is refreshToken in db? if yes we will delete it and if not we will clear jwt from cookies
    const foundUser = await User.findOne({ refreshToken : refreshToken }).exec();
    if(!foundUser) {
        res.clearCookie('jwt', { httpOnly : true });
        res.sendStatus(204);
    }

    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);
    
    res.clearCookie('jwt', { httpOnly : true })
    res.sendStatus(204);

}

module.exports = { handleLogout } ; 
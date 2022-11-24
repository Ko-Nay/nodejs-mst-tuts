const userDB = {
    users : require('../models/users'),
    setUsers : function (data) { this.users = data }
};

const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async ( req, res ) =>{
    const cookies = req.cookies
    // if( !cookies?.jwt ) return res.sendStatus(401);
    if( ! cookies && cookies.jwt ) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    //Is refreshToken in db? if yes we will delete it and if not we will clear jwt from cookies
    const foundUser = userDB.users.find( person => person.refreshToken === refreshToken ) ;
    if(!foundUser) {
        res.clearCookie('jwt', { httpOnly : true });
        res.sendStatus(204);
    }

    const otherUsers = userDB.users.filter( person => person.refreshToken !== foundUser.refreshToken)
    const currentUser = { ...foundUser, refreshToken: '' };
    userDB.setUsers([...otherUsers, currentUser]);

    //and then we will save to the db
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'models', 'users.json'),
        JSON.stringify(userDB.users)
    );

    res.clearCookie('jwt', { httpOnly : true })
    res.sendStatus(204);

}

module.exports = { handleLogout } ; 
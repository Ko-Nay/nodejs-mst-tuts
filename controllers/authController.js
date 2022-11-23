const userDB = {
    users : require('../models/users'),
    setUsers : function (data) { this.users = data }
}

const bcrypt = require('bcrypt');

const handleLogin = async ( req, res ) => {
    const { user, pwd } = req.body;
    if(!user || !pwd ) return res.status(400).json({ "message" : "Username and Password are required"});

    const foundUser = userDB.users.find( person => person.username === user );
    if(!foundUser) return res.sendStatus(401);

    const match = await bcrypt.compare(pwd, foundUser.password);

    if(match){
        res.json({ 'success ' : `User ${user} Logged in`})
    }else{
        res.status(400).json({'err' : 'Password does not match'})
    }

}

module.exports = { handleLogin };
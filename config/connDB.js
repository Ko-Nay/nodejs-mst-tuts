const mongoose = require('mongoose');

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.DATABASE_ACCESS_URI, {
            useUnifiedTopology : true,
            useNewUrlParser : true,
        })

    }catch(err) {
        console.error('connError: ', err);
    }
}

module.exports = connectDB ; 
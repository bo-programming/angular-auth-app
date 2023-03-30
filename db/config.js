const mongoose = require( 'mongoose' );

const db_connection = async () => {
    
    try{

        await mongoose.connect( process.env.DB_CONECT_MONGO );

        console.log('Db Online');

    }catch( error ){
        console.log(error);
        throw new Error('Error al conectar con la base de datos.');
    }

}


module.exports = { db_connection }

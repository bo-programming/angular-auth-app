const express = require('express');
const cors = require('cors');
const path = require( 'path' );
const { db_connection } = require('./db/config');
require('dotenv').config();

const app = express();

//directorio publico
app.use( express.static( 'public' ) );

//Base de datos
db_connection();

//CORS
app.use( cors() )

//lectura y parseo del json
app.use( express.json() );

//manage another url of site
app.get( '*', ( req, res ) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html' ) );
} );

//routes
app.use( '/api/auth', require( './routes/auth.route' )  );

app.listen( process.env.PORT, () => {
    console.log(`Server running in port ${ process.env.PORT }`);
} );
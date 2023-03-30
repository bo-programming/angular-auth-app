const { response, request } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generate_token } = require('../helpers/jwt');

const create_user = async ( req = request, res = response ) => {

    const { email, name, password } = req.body;

    try {
        // Verificar el email
        const usuario = await User.findOne( { email : email } );
        
        if ( usuario ) {
            return res.status(400).json({
                ok : false,
                msg : 'Correo ya esta siendo utilizado'
            });
        }

        // crear usuario con el modelo
        const dbuser = new User( req.body );

        // hash password
        const salt = bcrypt.genSaltSync();
        // Encripta la contraseña
        dbuser.password = bcrypt.hashSync( password, salt );
        // generate json web-tolken
        const token = await generate_token( dbuser.id, dbuser.name );
        // crear usuario de bd
        await dbuser.save();
        
        // generate response
        return res.status(201).json({
            ok : true,
            uid : dbuser.id,
            name : name,
            email : dbuser.email,
            token : token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor comuniquese con soporte'
        });
    }
}

const login = async ( req = request, res = response ) => {
    const { email, password } = req.body;

    try {
        const DBuser = await User.findOne({ email : email });
        if ( !DBuser ) {
            return res.status(400).json({
                ok : false,
                msg : 'No hay coincidencias con el correo electronico.'
            });
        }

        //confirmar si el password 
        const validar_password = bcrypt.compareSync( password, DBuser.password );

        if ( !validar_password ) {
            return res.status(400).json({
                ok : false,
                msg : 'Password incorrecta.'
            });
        }
        //generate jwt
        const token = await generate_token( DBuser.id, DBuser.name );

        return res.json({
            ok : true,
            uid : DBuser.id,
            name : DBuser.name,
            email : DBuser.email,
            token : token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: true,
            msg: 'Talk with admin'
        }); 
    }
    
}

const validacion = async ( req, res = response ) => {
    const { uid } = req;
    //get user by uid
    const DBuser = await User.findById( uid );
    console.log( DBuser );

    //generate jwt
    const token = await generate_token( uid, DBuser.name );
    return res.json({
        ok: true,
        msg: 'Renew',
        uid,
        name : DBuser.name,
        email : DBuser.email, 
        token
    });
}

module.exports = { create_user, login, validacion }
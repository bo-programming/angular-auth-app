const { Router } = require('express');
const { check } = require('express-validator');
const { create_user, login, validacion } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//crear nuevo usuario
router.post( '/new', [ 
                        check( 'name', 'El campo nombre es requerido' ).not().notEmpty(),
                        check('email', 'El email es obligatorio').isEmail(),
                        check('password', 'La contraseña es obligatoria').isLength( { min : 6 } ),
                        validarCampos
                     ], create_user );

//login in
router.post( '/', [ 
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength( { min : 6 } ),
    validarCampos
 ] , login );

//validar y reevalidar token
router.get( '/renew', validarJWT, validacion );

module.exports = router;
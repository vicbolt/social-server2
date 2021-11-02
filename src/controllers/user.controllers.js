const models = require('../models/index')
const utils = require('../utils')
const jwt = require('jsonwebtoken')
const config = require('../config')


const signUp = async (req,res) => {
    try{
        const { email, password1, password2 } = req.body

        const file = req.file

        const hostname = 'http://localhost:3200/'  //definimos la ruta que vamos a usar para guardar la foto

        const hash = await utils.bcrypt.encrypt(password1)

        const user = {
            avatar: hostname + file.filename,
            email,
            password1: hash
        }

        const data = await models.user.create(user)

        return res.status(201).json({ data })

    }catch(err){
        return res.json({err})
    }
}


const signIn = async (req,res) => {
    try{
        const { email, password } = req.body

        const user = await models.user.findOne({email})
        if(!user){
            return res.json({error: 'Usuario no encontrado'})
        }

        const isValid = await utils.bcrypt.compare(password, user.password1)
        if (!isValid){
            return res.json({ error: 'La contraseña es incorrecta'})
        }

        const token = jwt.sign({user}, config.jwt.secret)

        return res.status(201).json({token})

    } catch (error){
        res.json({error: 'No se ha podido iniciar sesión'})
    }
}




module.exports = {

    signIn,
    signUp
}
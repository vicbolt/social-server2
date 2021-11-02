const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    avatar: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password1: {
        type: String,
        required: true,
    }
},{
    timestamps: true,
    versionKey: false,
})


module.exports = model('User', userSchema)
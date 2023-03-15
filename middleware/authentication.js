const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')


const auth = (req,res,next)=>{
    //checking header
    const authheader = req.headers.authorization
    if(!authheader || !authheader.startsWith('Bearer ')){
        throw new UnauthenticatedError('Authorization invalid')
    }

    const token = authheader.split(' ')[1]

    try {
        
        const payload = jwt.verify(token,process.env.JWT_SECRET)

        //attaching user to req object
        req.user = {userId:payload.userId, name:payload.name}


        next()
    } catch (error) {
        throw new UnauthenticatedError('Authorization invalid')
    }
}

module.exports = auth
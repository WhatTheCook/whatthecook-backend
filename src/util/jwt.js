const jwt = require('jsonwebtoken');
const generateToken = async (data) => {
    console.log(data)
    const token = await jwt.sign(data, process.env.JWT_SECRET);
    return token
}
const authenticate = async (req,res,next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    await jwt.verify(token, process.env.JWT_SECRET, (err,user) => {
        console.log(user)
        console.log(err)

        if (err) return res.sendStatus(403)

        req.user = user

        next()
    })
}
module.exports = {generateToken,authenticate}
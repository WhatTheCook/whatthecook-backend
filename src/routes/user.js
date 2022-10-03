const router = require("express").Router();
const { PrismaClient } = require('@prisma/client')
const {user} = new PrismaClient()
const jwt = require('jsonwebtoken');
const {hashPassword} = require("../util/encrypt");
const {generateToken, authenticate} = require("../util/jwt");
const {login} = require("../controller/user");
const {register} = require("../controller/user");

//get user
router.get('/', authenticate ,async (req,res) => {
    const user_id = req.user.user_id;
    console.log(user_id)
    const users = await user.findFirst({
        select:{
            username:true,
            email:true,
        },
        where:{
            id: user_id
        }
    });
    res.json(users)
})

//login
router.post('/login', login)
// register
router.post('/register',register)

module.exports = router

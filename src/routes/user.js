const router = require("express").Router();
const { PrismaClient } = require('@prisma/client')
const {user} = new PrismaClient()
const jwt = require('jsonwebtoken');
const {hashPassword} = require("../util/encrypt");
const {generateToken, authenticate} = require("../util/jwt");
const {login} = require("../controller/user");

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
router.post('/register',async (req,res) =>{
    const {username,email,password} = req.body;
    const userExists = await user.findUnique({
        where:{
            email
        },
        select:{
            email: true
        }
    });
    if (userExists){
        return res.status(400).json({
            msg: "user already exists"
        })
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await user.create({
        data:{
            username,
            email,
            password: hashedPassword
        }
    });
    const userId = newUser.id
    const token = await generateToken({user_id:userId})
    res.json({token})
})

module.exports = router

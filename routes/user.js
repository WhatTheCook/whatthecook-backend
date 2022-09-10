const router = require("express").Router();
const { PrismaClient } = require('@prisma/client')
const {user} = new PrismaClient()

router.get('/',async (req,res) => {
    const users = await user.findMany({
        select:{
            username:true,
            email:true,
        },
        where:{
            id:1
        }
    });
    res.json(users)
})
router.post('/',async (req,res) =>{
    const {username} = req.body;
    const {email} = req.body;
    const {password} = req.body;

    const userExists = await user.findUnique({
        where:{
            email
        },
        select:{
            email: true,
        }
    });
    if (userExists){
        return res.status(400).json({
            msg: "user already exists"
        })
    }
    const newUser = await user.create({
        data:{
            username,
            email,
            password
        }
    });
    res.json(newUser)
})

module.exports = router

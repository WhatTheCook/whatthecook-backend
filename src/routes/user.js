const router = require("express").Router();
const { PrismaClient } = require('@prisma/client')
const { user } = new PrismaClient()
const jwt = require('jsonwebtoken');
const { hashPassword } = require("../util/encrypt");
const { generateToken, authenticate } = require("../util/jwt");
const { login } = require("../controller/user");
const { register } = require("../controller/user");
const nanoid = require("nanoid");
const nodemailer = require('nodemailer');
const NodeCache = require("node-cache");
const Cache = new NodeCache();

//get user
router.get('/', authenticate, async (req, res) => {
    const user_id = req.user.user_id;
    console.log(user_id)
    const users = await user.findFirst({
        select: {
            username: true,
            email: true,
        },
        where: {
            id: user_id
        }
    });
    res.json(users)
})

//login
router.post('/login', login)
// register
router.post('/register', register)

//reset password
router.post('/sendOTP', async (req, res) => {
    const { email } = req.body;
    const Currentuser = await user.findFirst({
        where: {
            email: email
        }
    })
    if (Currentuser == null) {
        return res.sendStatus(404)
    }
    const OTP = nanoid.customAlphabet("0123456789", 6)()
    Cache.set(OTP, Currentuser.id, 300)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'whatthecook3567@gmail.com',
            pass: 'yxfwdhjdbokgkfap'
        }
    });
    const mailOptions = {
        from: 'whatthecook3567@gmail.com', // sender address
        to: email, // list of receivers
        subject: 'WhatTheCook reset password', // Subject line
        html: `<h1>Dear WhatTheCook member,</h1> <b> \n Your OTP code:</b> <b>${OTP}</b> <p> Please do not send the code to other</p> <p> OTP will be expired in 6 minutes</p>`// plain text body
    };
    await transporter.sendMail(mailOptions)

    return res.sendStatus(201)
})

// check OTP
router.post('/checkOTP', async (req, res) => {
    const { OTP } = req.body;
    const userId = Cache.get(OTP)
    if (!userId) {
        return res.sendStatus(400)
    }
    return res.sendStatus(200)
})

// change password

router.post('/changePassword', async (req, res) => {
    const { OTP, password } = req.body;
    const userId = Cache.get(OTP)
    if (!userId) {
        return res.sendStatus(400)
    }
    const hashedPassword = await hashPassword(password);
    await user.updateMany({
        where: {
            id: userId
        },
        data: {
            password: hashedPassword
        }
    });
    return res.sendStatus(201)
})


module.exports = router

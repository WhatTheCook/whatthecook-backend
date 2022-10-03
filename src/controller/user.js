const { PrismaClient } = require('@prisma/client')
const {comparePassword, hashPassword} = require("../util/encrypt");
const {generateToken} = require("../util/jwt");
const {user} = new PrismaClient()

    const login = async (req,res) => {
        try {
            const {email, password} = req.body;
            const currentUser = await user.findFirst({
                where: {
                    email
                }
            })
            if (currentUser == null) {
                res.sendStatus(404)
                return
            }
            console.log(password, currentUser)
            if (!await comparePassword(password, currentUser.password)) {
                res.sendStatus(401)
                return
            }
            const userId = currentUser.id
            const token = await generateToken({user_id: userId})
            res.json({token})
        }
        catch (error) {
                console.error(error);
            }
}


    const register = async (req,res) => {
        try {
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
        } catch (error) {
            console.error(error);
        }
    }

module.exports = {login,register}

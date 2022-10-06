const router = require("express").Router();
const { PrismaClient } = require('@prisma/client')
const {user,recipe,menu,recipe_fav} = new PrismaClient()
const jwt = require('jsonwebtoken');
const {hashPassword} = require("../util/encrypt");
const {generateToken, authenticate} = require("../util/jwt");

//get user
router.put('/editUserInfo', authenticate ,async (req,res) => {
    const {username,email} = req.body;
    const userId = req.user.user_id;
    const userExists = await user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!userExists) {
        return res.status(400).json({
            msg: "user not found",
        });
    }
    const updateProfile = await user.update({
        where: {
            id:userId
        },
        data: {
            username:username,
            email:email
        },
    });
    res.json(updateProfile)
})

//get user fav

//get recipe fav by userId
router.get('/recipeFav', authenticate ,async (req,res) => {
    const userId = req.user.user_id;
    const recipesFav = await recipe.findMany({
        where:{
            id:userId
        },
        include: {
            _count: {
                select: { Recipe_fav: true },
            },
        }
    });
    res.json(recipesFav)
})

module.exports = router;
const router = require("express").Router();
const { PrismaClient } = require('@prisma/client')
const {user,recipe,menu,recipe_fav,comment_fav,comment} = new PrismaClient()
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
    const recipesFav = await recipe_fav.findMany({
        include: {
            recipe: {
                select:{
                    _count: {
                        select: { Recipe_fav: true },
                    },
                    name:true,
                    cooking_time: true,
                    category:{
                        select: {name:true}
                    },
                    PictureURL: true
                }
            }
        },
        where:{
            userId:userId,
        },
        orderBy: {
            recipe: {
                Recipe_fav:{
                    _count: 'desc'
                }
            }
        }
    });
    res.json(recipesFav)
})

//get comment fav by userId
router.get('/commentFav', authenticate ,async (req,res) => {
    const userId = req.user.user_id;
    const commentFavByUser = await comment_fav.findMany({
        include: {
            comment: {
                select:{
                    _count: {
                        select: { Comment_fav: true },
                    },
                    content:true,
                    createdAt: true,
                    author: {
                        select: { username: true },
                    },
                    menu:{
                        select: {name:true}
                    },
                }
            }
        },
        where:{
            userId:userId
        },
        orderBy: {
            comment: {
                Comment_fav:{
                    _count: 'desc'
                }
            }
        }
    });
    res.json(commentFavByUser)
})

// My article
router.get('/myArticle', authenticate ,async (req,res) => {
    const userId = req.user.user_id;
    const myArticle = await comment.findMany({
        where:{
            authorId:userId
        },
        include: {
            _count: {
                select: { Comment_fav: true },
            },
            author: { // ไม่ได้ใช้โชว์เอามาลองcheck ตอนtestเฉยๆ
                select: { username: true },
            },
            menu:{
                select: { name: true}
            }
        },
        orderBy: {
            Comment_fav: {
                _count: 'desc'
            }
        }
    });
    res.json(myArticle)
})

module.exports = router;
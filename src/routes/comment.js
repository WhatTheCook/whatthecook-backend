const router = require("express").Router();
const { PrismaClient } = require('@prisma/client')
const {user,comment,menu,comment_fav} = new PrismaClient()
const jwt = require('jsonwebtoken');
const {hashPassword} = require("../util/encrypt");
const {generateToken, authenticate} = require("../util/jwt");
const {login} = require("../controller/user");

// create new post + check the exists user,menu
router.post('/create', authenticate ,async (req,res) => {
    const { content,menuId} = req.body;
    const  authorId = req.user.user_id;
    const userExists = await user.findUnique({
        where: {
            id: authorId
        }
    });
    if (!userExists){
        return res.status(400).json({
            msg: "user not found"
        })
    }
    const menuExists = await menu.findUnique({
        where: {
            id: menuId
        }
    });
    if (!menuExists){
        return res.status(400).json({
            msg: "menu not found"
        })
    }
    const newComment = await comment.create({
        data:{
            content,
            authorId,
            menuId,
        }
    });
    res.json(newComment)
})

//comment fav
router.post('/', authenticate ,async (req,res) => {
    const {commentId} = req.body;
    const userId = req.user.user_id;
    const userExists = await user.findUnique({
        where: {
            id: userId
        }
    });
    if (!userExists){
        return res.status(400).json({
            msg: "user not found"
        })
    }
    const commentExists = await comment.findUnique({
        where: {
            id: commentId
        }
    });
    if (!commentExists){
        return res.status(400).json({
            msg: "menu not found"
        })
    }
    const newCommentFav = await comment_fav.create({
        data:{
            commentId,
            userId
        }
    });
    res.json(newCommentFav)
})
//show fav comment of that user
router.get('/favorite', authenticate ,async (req,res) => {
    const userId = req.user.user_id;
    const userCommentFav = await comment_fav.findMany({
        select:{
            commentId:true,
        },
        where:{
            id: userId
        }
    });
    res.json(userCommentFav)
})
module.exports = router

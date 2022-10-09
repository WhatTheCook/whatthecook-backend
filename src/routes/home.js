const router = require("express").Router();
const { PrismaClient } = require('@prisma/client')
const {user,recipe_fav,method} = new PrismaClient()
const jwt = require('jsonwebtoken');
const {hashPassword} = require("../util/encrypt");
const {generateToken, authenticate} = require("../util/jwt");


// like recipe
router.post("/likeRecipe", authenticate, async (req, res) => {
    const { recipeId } = req.body;
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
    const newRecipeFav = await recipe_fav.create({
        data: {
            recipeId,
            userId,
        },
    });
    res.json(newRecipeFav);
});
// unlike recipe
router.delete('/unlikeRecipe', authenticate ,async (req,res) => {
    const {recipeId} = req.body;
    const deleteRecipeFav = await recipe_fav.delete({
        where: {
            id:recipeId
        },
    });
    res.json(deleteRecipeFav)
})

//test get menu method

router.get('/method', authenticate ,async (req,res) => {
        const methods = await method.findMany({
            include:{
                recipe:{
                    select:{name:true}
                }
            }
    });
    res.json(methods)
})
module.exports = router;
const router = require("express").Router();
const { PrismaClient } = require('@prisma/client')
const {user,recipe_fav,method,recipe,recipe_ingredient,ingredient} = new PrismaClient()
const jwt = require('jsonwebtoken');
const {hashPassword} = require("../util/encrypt");
const {generateToken, authenticate} = require("../util/jwt");
const {tuple} = require("prisma/prisma-client/generator-build");


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
});

// get menu method
router.get('/recipeDetail', authenticate ,async (req,res) => {
    const {recipeId} = req.query;
    const methods = await recipe.findMany({
        where:{
            id: recipeId
        },
        include:{
                category: {
                    select: {
                        name:true
                    }
                },
            Method: {
                select: {
                    step: true,
                    description: true
                },
                orderBy:{
                    step: 'asc'
                }
            },
            Recipe_ingredient: {
                select:{
                    amount: true,
                    ingredient:{
                        select: {
                            name:true,
                            unit: true
                        }
                    }
                }
            }
        },

    });
    res.json(methods)
})

// suggest menu
router.get('/suggestMenu', authenticate ,async (req,res) => {
    const userId = req.user.user_id;
    const displayMenus = [];
    const menuSet = new Set();
    const {ingredients} = req.body;
    for (const ingredient of ingredients) {
        const menus = await recipe.findMany({

        })
    }

})


module.exports = router;
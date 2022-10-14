const router = require("express").Router();
const { PrismaClient } = require('@prisma/client')
const {user,recipe_fav,method,recipe} = new PrismaClient()
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
        const methods = await method.findMany({
            where:{
                recipeId: recipeId
            },
            include:{
                recipe:{
                    select:{
                        name:true,
                        cooking_time: true,
                        category:{
                            select: {
                                name:true
                            }
                        }
                    }
                },

            },
            orderBy: {
                step: 'asc'
            }
    });
    res.json(methods)
})

router.post('/findRecipes', authenticate ,async (req,res) => {
    const {ingredients} = req.body;
    // const foundIngredients = [];
    for (const {name, amount} of ingredients){
        const findIngredients = await ingredient.findFirst({
            where:{
                name:{
                    equals: name
                }
            },
        });
        // if (findIngredients){
        //     foundIngredients.push({name,amount,unit: findIngredients.unit})
        // }
    }
    res.json(foundIngredients)
})
module.exports = router;
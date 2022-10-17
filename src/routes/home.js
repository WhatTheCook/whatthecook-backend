const router = require("express").Router();
const { PrismaClient } = require('@prisma/client')
const {user,recipe_fav,method,recipe,recipe_ingredient,ingredient,pantry} = new PrismaClient()
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
// หาก่อนว่า user มี ingre ไรบ้าง จำนวนเท่าไหร่ // line 7 in gob code
// loop จาก ingre ที่ได้มา เพื่อดูว่า ingre ทำไรได้บ้าง // search -> เก้บเป็น set
router.get('/suggestMenu', authenticate ,async (req,res) => {
    const userId = req.user.user_id;
    //     const userIngredient = await pantry.findMany({
    //         where: {
    //             userId: userId
    //         },
    //         include: {
    //             ingredient: {
    //                 select: {
    //                     name: true,
    //                     unit: true
    //                 }
    //             }
    //         },
    // })
    // for (const {name, amount} of userIngredient) {
    // const {name} = req.query
    //     const findRecipe = await ingredient.findMany({
    //         where:{
    //             name:name
    //         },
    //         include:{
    //             Recipe_ingredient:{
    //                 select:{
    //                     recipeId: true
    //                 },
    //             },
    //             recipe:{
    //                 select:{
    //                     name:true
    //                 }
    //             }
    //         }
    //     });
    //
    //     res.json(findRecipe)

})


module.exports = router;
const router = require("express").Router();
const { PrismaClient } = require('@prisma/client')
const { user, recipe_fav, method, recipe, recipe_ingredient, ingredient, pantry } = new PrismaClient()
const jwt = require('jsonwebtoken');
const { hashPassword } = require("../util/encrypt");
const { generateToken, authenticate } = require("../util/jwt");
const { tuple } = require("prisma/prisma-client/generator-build");


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
    const duplicateFav = await recipe_fav.findFirst({
        where: {
          recipeId: recipeId,
          userId: userId
        }
      });
      if (duplicateFav) {
        return res.status(400).json({
          msg: "liked",
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
router.delete('/unlikeRecipe', authenticate, async (req, res) => {
    const { recipeId } = req.body;
    const userId = req.user.user_id;
    const deleteRecipeFav = await recipe_fav.deleteMany({
        where: {
            recipeId: recipeId,
            userId: userId
        },
    });
    res.json(deleteRecipeFav)
});

// get menu method
router.get('/recipeDetail', authenticate, async (req, res) => {
    const { recipeId } = req.query;
    const recipes = await recipe.findMany({
        where: {
            id: recipeId
        },
        include: {
            category: {
                select: {
                    name: true
                }
            },
            Method: {
                select: {
                    step: true,
                    description: true
                },
                orderBy: {
                    step: 'asc'
                }
            },
            Recipe_ingredient: {
                select: {
                    amount: true,
                    ingredient: {
                        select: {
                            name: true,
                            unit: true
                        }
                    }
                }
            }
        },
    });
    const count = await recipe_fav.count({ where: { userId: req.user.user_id, recipeId } })
    recipes[0].Method.sort((a,b) => parseInt(a.step) - parseInt(b.step))
    recipes[0].is_like = count === 1
    res.json(recipes)
})

// suggest menu 

router.get('/suggestMenu', authenticate, async (req, res) => {
    const userId = req.user.user_id;
    const userIngredient = await pantry.findMany({
        select: {
            ingredientId: true,
            amount: true
        },
        where: {  userId: userId },
    })
    const ingredientCondition = userIngredient.map(ingredient => ({
        ingredientId: ingredient.ingredientId, amount: { lte: ingredient.amount }
    }))
    const recipes = await recipe.findMany({
        where: {
            Recipe_ingredient: {
                every: {
                    OR: [...ingredientCondition,  { optional: true }, ],
                },
            },
        },
        include: {
            _count: {
                select: {
                    Recipe_fav: true
                }
            },

            category: {
                select: {
                    name: true
                }
            }
        },
        distinct: ['id'],
    });
    res.json(recipes)
})

// suggest menu seperated by cat

router.get('/suggestMenuByCat', authenticate, async (req, res) => {
    const userId = req.user.user_id;
    const userIngredient = await pantry.findMany({
        select: {
            ingredientId: true,
            amount: true
        },
        where: {  userId: userId },
    })
    const ingredientCondition = userIngredient.map(ingredient => ({
        ingredientId: ingredient.ingredientId, amount: { lte: ingredient.amount }
    }))
    const {categoryId} = req.query;
    const recipes = await recipe.findMany({
        where: {
            Recipe_ingredient: {
                every: {
                    OR: [...ingredientCondition,  { optional: true }, ],
                },
            },
            categoryId:categoryId
        },
        include: {
            _count: {
                select: {
                    Recipe_fav: true
                }
            },

            category: {
                select: {
                    name: true
                }
            }
        },
        distinct: ['id'],
    });
    res.json(recipes)
})

module.exports = router;

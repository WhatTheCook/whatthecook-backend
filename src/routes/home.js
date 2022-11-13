const router = require("express").Router();
const { PrismaClient } = require('@prisma/client')
const { user, recipe_fav, method, recipe, recipe_ingredient, ingredient, pantry } = new PrismaClient()
const jwt = require('jsonwebtoken');
const { hashPassword } = require("../util/encrypt");
const { generateToken, authenticate } = require("../util/jwt");
const { tuple, re } = require("prisma/prisma-client/generator-build");

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
    recipes[0].Method.sort((a, b) => parseInt(a.step) - parseInt(b.step))
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
        where: {
            userId: userId
        },

    })
    const ingredientCondition = userIngredient.map(ingredient => ({
        ingredientId: ingredient.ingredientId, amount: { lte: ingredient.amount }
    }))
    let recipes = await recipe.findMany({
        where: {
            Recipe_ingredient: {
                some: {
                    OR: [...ingredientCondition]
                }
            },
        },
        include: {
            _count: {
                select: {
                    Recipe_fav: true,
                    Recipe_ingredient: {
                        where: {
                            type: 'MAIN',
                            ingredientId: {
                                notIn: userIngredient.map(ingredient => ingredient.ingredientId),
                            }
                        }
                    }
                },
            },
            category: {
                select: {
                    name: true
                }
            },
        },
        distinct: ['id'],
    });
    recipes.sort((a, b) => a._count.Recipe_ingredient - b._count.Recipe_ingredient)
    recipes = recipes.map(recipe => ({ ...recipe, _count: { Recipe_fav: recipe._count.Recipe_fav, missing_count: recipe._count.Recipe_ingredient } }))
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
        where: { userId: userId },
    })
    const ingredientCondition = userIngredient.map(ingredient => ({
        ingredientId: ingredient.ingredientId, amount: { lte: ingredient.amount }
    }))
    const { categoryId } = req.query
    let recipes = await recipe.findMany({
        where: {
            Recipe_ingredient: {
                some: {
                    OR: [...ingredientCondition]
                }
            },
            categoryId: categoryId
        },
        include: {
            _count: {
                select: {
                    Recipe_fav: true,
                    Recipe_ingredient: {
                        where: {
                            type: 'MAIN',
                            ingredientId: {
                                notIn: userIngredient.map(ingredient => ingredient.ingredientId),
                            }
                        }
                    }
                },
            },
            category: {
                select: {
                    name: true
                }
            },
        },
        distinct: ['id'],
    });
    recipes.sort((a, b) => a._count.Recipe_ingredient - b._count.Recipe_ingredient)
    recipes = recipes.map(recipe => ({ ...recipe, _count: { Recipe_fav: recipe._count.Recipe_fav, missing_count: recipe._count.Recipe_ingredient } }))
    res.json(recipes)
})

// missing ingredient

router.get('/missingIngredients', authenticate, async (req, res) => {
    const userId = req.user.user_id;
    const userIngredient = await pantry.findMany({
        select: {
            ingredientId: true,
            amount: true
        },
        where: { userId: userId },
    });
    console.log(userIngredient)
    const dict = {}
    userIngredient.forEach(i => {
        dict[i.ingredientId] = i.amount
    });
    console.log(dict)
    const { recipeId } = req.query;
    const matchIngredient = await recipe_ingredient.findMany({
        where: {
            recipeId
        },
        include: {
            ingredient: { select: { name: true, unit: true } }
        },

    });

    const result = matchIngredient.map((i) => ({
        ...i,
        ingredient: i.ingredient.name, unit: i.ingredient.unit,
        miss: i.type != 'SEASONING' && (!dict[i.ingredientId] || i.amount > dict[i.ingredientId]),
    }))
    console.log(matchIngredient)
    res.json(result)
});

// calculate remaining ingredient

router.put('/clickForCook', authenticate, async (req, res) => {
    const { recipeId } = req.query;
    const userId = req.user.user_id;
    const recipeIngredient = await recipe_ingredient.findMany({
        select: {
            ingredientId: true,
            amount: true,
            ingredient: {
                select: { name: true }
            }
        },
        where: {
            recipeId: recipeId
        },
    });

    for (const { ingredientId, amount } of recipeIngredient) {
        const checkIngredient = await pantry.findFirst({
            where: {
                ingredientId: ingredientId,
                userId: userId,
                amount: { gte: amount }
            }
        });
        console.log(checkIngredient)
        if (checkIngredient) {
            const newAmount = checkIngredient.amount - amount
            const updateAmount = await pantry.updateMany({
                where: {
                    userId,
                    ingredientId: ingredientId
                },
                data: {
                    amount:newAmount
                },
            });
            console.log(updateAmount)
        }
        if(checkIngredient == null){
            return res.sendStatus(404) 
        }
    }
    res.sendStatus(200)
})


module.exports = router;

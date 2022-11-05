const router = require("express").Router();
const { PrismaClient } = require('@prisma/client')
const { ingredient, pantry } = new PrismaClient()
const jwt = require('jsonwebtoken');
const { hashPassword } = require("../util/encrypt");
const { generateToken, authenticate } = require("../util/jwt");
const { login } = require("../controller/user");

// search menu
router.post('/findIngredients', authenticate, async (req, res) => {
    const { ingredients } = req.body;
    const foundIngredients = [];
    for (const { name, amount } of ingredients) {
        const findIngredients = await ingredient.findFirst({
            where: {
                name: {
                    equals: name
                },
            },
        });
        if (findIngredients) {
            foundIngredients.push({ id: findIngredients.id, name, amount, unit: findIngredients.unit })
        }
    }
    res.json(foundIngredients)
})

router.post('/searchIngredient', async (req, res) => {
    const { ingredientName } = req.body;
    const findIngredients = await ingredient.findFirst({
        where: {
            name: {
                equals: ingredientName
            },
        },
    });
    if(findIngredients == null) {
        res.status(400).json({"message": "Ingredient not found"})
    }
    res.json(findIngredients)
})


//select all ingredients
router.get("/listIngredients", authenticate, async (req, res) => {
    const ingredients = await ingredient.findMany({
        select: {
            id: true,
            name: true,
        },
    });
    res.json(ingredients);
});

// add pantry
router.post('/addIngredient', authenticate, async (req, res) => {
    const { ingredients } = req.body;
    const userId = req.user.user_id;
    for (const { ingredientId, amount } of ingredients) {
        const duplicateIngredients = await pantry.findFirst({
            where: {
                ingredientId: ingredientId,
                userId: userId
            }
        });
        let newamount = amount;
        if (duplicateIngredients) {
            newamount = duplicateIngredients.amount + newamount;
            await pantry.update({
                where: {
                    id: duplicateIngredients.id
                },
                data: {
                    amount: newamount
                }
            })
            continue
        }
        const updateAmount = await pantry.create({
            data: {
                ingredientId,
                userId,
                amount: newamount
            }
        });
    }
    res.json({"message": "Created"});
})

// get user ingredient to show in pantry

router.get("/userIngredients", authenticate, async (req, res) => {
    const userId = req.user.user_id;
    const userIngredients = await pantry.findMany({
        where: {
            userId: userId,

        },
        include: {
            ingredient: {
                select: {
                    name: true,
                    unit: true,
                },
                
            }
        }
    });
    res.json(userIngredients);
});

// delete ingredients in pantry
router.delete('/deleteIngredient', authenticate, async (req, res) => {
    const { ingredientId } = req.body;
    const userId = req.user.user_id;
    const deleteIngredient = await pantry.deleteMany({
        where: {
            ingredientId: ingredientId,
            userId: userId
        },
    });
    res.json(deleteIngredient)
});


module.exports = router;

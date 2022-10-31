const router = require("express").Router();
const { PrismaClient } = require('@prisma/client')
const {ingredient,pantry} = new PrismaClient()
const jwt = require('jsonwebtoken');
const {hashPassword} = require("../util/encrypt");
const {generateToken, authenticate} = require("../util/jwt");
const {login} = require("../controller/user");

// search menu
router.post('/findIngredients', authenticate ,async (req,res) => {
    const {ingredients} = req.body;
    const foundIngredients = [];
    for (const {name, amount} of ingredients){
        const findIngredients = await ingredient.findFirst({
            where:{
                name:{
                    equals: name
                },
            },
        });
        if (findIngredients){
            foundIngredients.push({name,amount,unit: findIngredients.unit})
        }
    }
    res.json(foundIngredients)
})


//select all ingredients
router.get("/listIngredients", authenticate, async (req, res) => {
    const ingredients = await ingredient.findMany({
        select: {
            id:true,
            name: true,
        },
    });
    res.json(ingredients);
});

// add pantry

router.post('/addPantry', authenticate ,async (req,res) => {
    const {ingredients} = req.body;
    const foundIngredients = [];
    for (const {name, amount} of ingredients){
        const findIngredients = await pantry.findFirst({
            where:{
                name:{
                    equals: name
                }
            },
        });
        if (findIngredients){
            foundIngredients.post({name,amount,unit: findIngredients.unit})
        }
    }
    res.json(userIngredient)
})




module.exports = router;
const router = require("express").Router();
const { PrismaClient } = require('@prisma/client')
const {ingredient} = new PrismaClient()
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
                }
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
            name: true,
        },
    });
    res.json(ingredients.map(i => i.name));
});





module.exports = router;
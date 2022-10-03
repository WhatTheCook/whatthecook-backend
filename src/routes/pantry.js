const router = require("express").Router();
const { PrismaClient } = require('@prisma/client')
const {user,comment,menu,comment_fav} = new PrismaClient()
const jwt = require('jsonwebtoken');
const {hashPassword} = require("../util/encrypt");
const {generateToken, authenticate} = require("../util/jwt");
const {login} = require("../controller/user");


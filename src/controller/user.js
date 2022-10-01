const { PrismaClient } = require("@prisma/client");
const { comparePassword } = require("../util/encrypt");
const { generateToken } = require("../util/jwt");
const { user } = new PrismaClient();
const login = async (req, res) => {
  const { email, password } = req.body;
  const currentUser = await user.findFirst({
    where: {
      email,
    },
  });
  if (currentUser == null) res.sendStatus(404);
  console.log(password, currentUser);
  if (!comparePassword(password, currentUser.password)) {
    res.sendStatus(401);
  }
  const userId = currentUser.id;
  const token = await generateToken({ user_id: userId });
  res.json({ token });
};
module.exports = { login };

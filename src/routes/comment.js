const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const { user, comment, menu, comment_fav, category } = new PrismaClient();
const jwt = require("jsonwebtoken");
const { hashPassword } = require("../util/encrypt");
const { generateToken, authenticate } = require("../util/jwt");
const { login } = require("../controller/user");

// create new post + check the exists user,menu
router.post("/create", authenticate, async (req, res) => {
  const { content, menuId } = req.body;
  const authorId = req.user.user_id;
  const userExists = await user.findUnique({
    where: {
      id: authorId,
    },
  });
  if (!userExists) {
    return res.status(400).json({
      msg: "user not found",
    });
  }
  const menuExists = await menu.findUnique({
    where: {
      id: menuId,
    },
  });
  if (!menuExists) {
    return res.status(400).json({
      msg: "menu not found",
    });
  }
  const newComment = await comment.create({
    data: {
      content,
      authorId,
      menuId,
    },
  });
  res.json(newComment);
});

//like
router.post("/like", authenticate, async (req, res) => {
  const { commentId } = req.body;
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
  const commentExists = await comment.findUnique({
    where: {
      id: commentId,
    },
  });
  if (!commentExists) {
    return res.status(400).json({
      msg: "menu not found",
    });
  }
  const newCommentFav = await comment_fav.create({
    data: {
      commentId,
      userId,
    },
  });
  res.json(newCommentFav);
});
//unlike
router.delete('/unlike', authenticate ,async (req,res) => {
    const {commentId} = req.body;
    const deleteFav = await comment_fav.delete({
        where: {
            id:commentId
        },
    });
    res.json(deleteFav)
})

//select all cat
router.get("/categories", authenticate, async (req, res) => {
  const categories = await category.findMany({
    select: {
      name: true,
    },
  });
  res.json(categories);
});
//select all menu in that cat
router.get('/menus', authenticate ,async (req,res) => {
    const {categoryId} = req.query;
    const menus= await menu.findMany({
        where:{
            categoryId:categoryId
        },
        include: {
            _count: {
                select: { Comment: true },
            },
            category: {
                select: {name: true}
            }
        },
        orderBy: {
            Comment: {
                _count: 'desc'
            }
        }
    });
    res.json(menus)
})
// edit comment
router.put('/editComment', authenticate ,async (req,res) => {
    const {commentId,content} = req.body;
    const userId = req.user.user_id;
    const commentExists = await comment.findFirst({
        where: {
            id: commentId,
            authorId:userId // this user comment
        }
    });
    if (!commentExists){
        return res.status(400).json({
            msg: "comment not found"
        })
    }
    const updateComment = await comment.update({
        where: {
            id:commentId,
        },
        data: {
            content:content,
            createdAt: new Date()
        },
    });
    res.json(updateComment)
})

// delete comment
router.delete('/deleteComment', authenticate ,async (req,res) => {
    const {commentId} = req.body;
    const userId = req.user.user_id;
    const commentExists = await comment.findFirst({
        where: {
            id: commentId,
            authorId:userId
        }
    });
    if (!commentExists){
        return res.status(400).json({
            msg: "comment not found"
        })
    }
    const deleteComment= await comment.delete({
        where: {
            id:commentId
        },
    });
    res.json(deleteComment)
})

// search category
router.get('/searchCat', authenticate ,async (req,res) => {
    const {name} = req.query;
    const searchCategory = await category.findMany({
        where:{
            name:{
                contains: name
            }
        }
    });
    res.json(searchCategory)
})

// search menu
router.get('/searchMenu', authenticate ,async (req,res) => {
    const {name} = req.query;
    const searchMenu = await menu.findMany({
        where:{
            name:{
                contains: name
            }
        },
        include: {
            _count: {
                select: { Comment: true },
            },
            category: {
                select: {name: true}
            }
        }
    });
    res.json(searchMenu)
})

//all comment in that menu
router.get("/:menuID", authenticate, async (req, res) => {
  const userId = req.user.user_id;
  const menuID = req.params.menuID;
  const comments = await comment.findMany({
    where: {
      menuId: menuID,
    },
    include: {
      _count: {
        select: { Comment_fav: true },
      },
      author: {
        select: { username: true },
      },
    },
      orderBy: {
          Comment_fav: {
              _count: 'desc'
          }
      }
  });
  res.json(comments);
});

module.exports = router;

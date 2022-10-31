# WhatTheCook API docs by pphawikaa

## get user

* URL:/api/user
* Method: GET
* Headers: Token
* Body: none
* Params: none
* Success: 200
```
{
    "username": String,
    "email": String
}
```
* Error: 400

---

## Register

* URL:/api/user/register
* Method: POST
* Headers: Token
* Body: 
```
{
    "username": String,
    "email": String,
    "password": String
}
```
* Params: none
* Success: 200
```
{
    "token"
}
```
* Error: 400

---

## Login

* URL:/api/user/login
* Method: POST
* Headers: Token
* Body: 
```
{
    "email": String,
    "password": String
}
```
* Params: none
* Success: 200
```
{
    "token"
}
```
* Error: 401 Unauthorized, 404 Not found

---

## Create comment

* URL:/api/comment/create
* Method: POST
* Headers: Token
* Body:
```
{
    "content": String,
    "menuId"
}
```
* Params: none
* Success: 200 
```
{
    "id",
    "createdAt": timestamp,
    "content": String
    "authorId"
    "menuId"
}
```
* Error: 400

---

## Like comment

* URL:/api/comment/like
* Method: POST
* Headers: Token
* Body:
```
{
    "commentId"
}
```
* Params: none
* Success: 200 
```
{
    "id",
    "userId",
    "commentId"
}
```
* Error: 400

---

## All comment of each menu

* URL:/api/user
* Method: GET
* Headers: Token
* Body: none
* Params: 
```
 {
     "id": `menuId`
 }
 ```
* Success: 200
```
[
    {
        "id",
        "createdAt": timestamp
        "content": String,
        "authorId",
        "menuId",
        "author": {
            "username": String
        },
        "_count": {
            "Comment_fav": int
        }
    }
]
```
* Error: 400


---

## Unlike comment

* URL:/api/comment/unlike
* Method: DELETE
* Headers: Token
* Body: 
```
 {
     "commentId"
 }
 ```
* Params: none
* Success: 200
```
{
    "id",
    "userId",
    "commentId"
}
```
* Error: 400

---

## All categories

* URL:/api/comment/categories
* Method: GET
* Headers: Token
* Body: none
* Params: none
* Success: 200
```
[
    {
        "name": String
    }
]
```
* Error: 400

---

## All menus in each category

* URL:/api/comment/menus
* Method: GET
* Headers: Token
* Body: 
```
 {
     "categoryId"
 }
 ```
* Params: none
* Success: 200
```
[
    {
        "id"
        "name": String
        "categoryId",
        "category": {
            "name": String
        },
        "_count": {
            "Comment": int
        }
    }
]
```
* Error: 400

---

## Edit comment

* URL:/api/comment/editComment
* Method: PUT
* Headers: Token
* Body: none
```
{
    "commentId",
    "content":String
}
 ```
* Params: none
* Success: 200
```
{
    "id",
    "createdAt": timestamp
    "content": String,
    "authorId",
    "menuId"
}
```
* Error: 400

---

## Delete comment

* URL:/api/comment/deleteComment
* Method: DELETE
* Headers: Token
* Body: none
* Params: 
```
 {
     "commentId"
 }
 ```
* Success: 200
```
{
    "id",
    "createdAt": timestamp,
    "content": String,
    "authorId",
    "menuId"
}
```
* Error: 400

---

## Search category

* URL:/api/comment/searchCat
* Method: GET
* Headers: Token
* Body: none
* Params: 
```
    {
        "name":String
    }
 ```
* Success: 200
```
[
    {
        "id",
        "name": String
    }
]
```
* Error: 400

---

## Search menu

* URL:/api/comment/searchMenu
* Method: GET
* Headers: Token
* Body: none
* Params:
```
 {
     "name":String
 }
 ```
* Success: 200
```
[
    {
        "id",
        "name": String
        "categoryId",
        "category": {
            "name": String
        },
        "_count": {
            "Comment": int
        }
    }
]
```
* Error: 400
---

## Edit user info

* URL:/api/profile/editUserInfo
* Method: PUT
* Headers: Token
* Body: none
```
{
    "username": String
    "email": String
}
 ```
* Params: none
* Success: 200
```
{
    "id": 
    "email": String
    "username": String
    "password": String
}
```
* Error: 400

---

## Like recipe

* URL:/api/home/likeRecipe
* Method: POST
* Headers: Token
* Body:
```
{
    "recipeId"
}
```
* Params: none
* Success: 200
```
{
    "id",
    "userId",
    "recipeId"
}
```
* Error: 400

---
## Unlike recipe

* URL:/api/home/unlikeRecipe
* Method: DELETE
* Headers: Token
* Body:
```
 {
     "recipeId"
 }
 ```
* Params: none
* Success: 200
```
{
    "id",
    "userId",
    "recipeId"
}
```
* Error: 400

--- 

## Get all recipes favorite by userid

* URL:/api/profile/recipeFav
* Method: GET
* Headers: Token
* Body: none
* Params: none
* Success: 200
```
[
    {
        "id",
        "userId",
        "recipeId",
        "recipe": {
            "name": String,
            "cooking_time": int,
            "category": {
                "name": String,
            },
            "_count": {
                "Recipe_fav": int
            }
        }
    },
 ]
```
* Error: 400
---
## Get all comments favorite by userid

* URL:/api/profile/commentFav
* Method: GET
* Headers: Token
* Body: none
* Params: none
* Success: 200
```
[
    {
        "id",
        "commentId",
        "userId",
        "comment": {
            "content": String,
            "createdAt": timestamp
            "author": {
                "username": String
            },
            "menu": {
                "name": String
            },
            "_count": {
                "Comment_fav": int
            }
        }
    }
 ]
```
* Error: 400
---

## My article
* URL:/api/profile/myArticle
* Method: GET
* Headers: Token
* Body: none
* Params: none
* Success: 200
```
[
    {
        "id",
        "createdAt": timestamp,
        "content": String,
        "authorId",
        "menuId",
        "author": {
            "username": String
        },
        "menu": {
            "name": String
        },
        "_count": {
            "Comment_fav": int
        }
    },
```
* Error: 400

---

## Find Ingredients

* URL: /api/pantry/findIngredients
* Method: POST
* Headers: Token
* Body:
```
  {
    "ingredients": [
        {"name": String, "amount": int},
         {"name": String, "amount": int},
    ]
  }
```
* Params: none
* Success: 200
```
[
    {
        "name": String,
        "amount": int,
        "unit": Sting
    },
    {
        "name": String,
        "amount": int,
        "unit": Sting
    }
]

```
* Error: 400
---

## Recipe detail
* URL: /api/home/recipeDetail
* Method: GET
* Headers: Token
* Body: none
* Params: 
```
{
    "recipeId"
}
```
* Success: 200
```
[
    {
        "id",
        "name": String
        "cooking_time": int,
        "categoryId",
        "PictureURL": URL,
        "category": {
            "name": String
        },
        "PictureURL": "https://goodlifeupdate.com/app/uploads/2020/12/web-2.jpg",
        "Method": [
            {
                "step": int,
                "description": String
            },
        ],
        "Recipe_ingredient": [
            {
                "amount": int,
                "ingredient": {
                    "name": String,
                    "unit": String,
                }
            },
        ]
    }
]

```
* Error: 400
---

## All ingredients name

* URL: /api/pantry/listIngredients
* Method: GET
* Headers: Token
* Body: none
* Params: none
* Success: 200
```
[
    "ตะไคร้",
    "ส้มโอ",
    "ใบแมงลัก",
    "ต้นหอม",
    "สายบัว",
    "ปลาน้ำเงิน",
    "นมหมู",
 ]

```
* Error: 400
---
## Suggest menu

* URL: /api/home/suggestMenu
* Method: GET
* Headers: Token
* Body: none
* Params: none
* Success: 200
```
[
    {
        "id",
        "name": String
        "cooking_time": int,
        "categoryId",
        "PictureURL": URL
        "_count": {
            "Recipe_fav": int
        }
    },
 ]

```
* Error: 400

## Suggest menu seperated by cat

* URL: /api/home/suggestMenuByCat
* Method: GET
* Headers: Token
* Body: none
* Params: 
```
    categoryId
```
* Success: 200
```
[
    {
        "id",
        "name": String
        "cooking_time": int,
        "categoryId",
        "PictureURL": URL
        "_count": {
            "Recipe_fav": int
        }
    },
 ]

```
* Error: 400











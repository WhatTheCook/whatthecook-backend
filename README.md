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
    "id": "d4c22242-2dde-4ab3-842f-7abf2366945a",
    "userId": "5e3f32fb-4359-4f14-a532-06e4fe7ba97d",
    "commentId": "72a78008-7b78-4a90-8643-c8aacecda281"
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
        "categoryId": "b687ca10-7ba3-4052-bc90-74a13b733d86",
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

* URL:/api/comment/menus
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
```
 {
     "name":String
 }
 ```
* Params: none
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
```
 {
     "name":String
 }
 ```
 * Params: none
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









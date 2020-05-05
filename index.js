//import express from 'express'; //ES2015 Modules

const express = require('express'); //CommonJS Modules
const db = require('./database')
const server = express();

server.use(express.json()); //teaches express how to read JSON from the body


server.get('/', (req, res) => {
    res.json({api: 'Up and running!' })
})

server.get("/api/users", (req, res) => {
 const users = db.getUsers()
 if (users) {
     res.json(users)
 }
 else {
    return res.status(500).json({ errorMessage: "The user information could not be retrieved."})
    }
})


server.get("/api/users/:id", (req, res) => {

    const userId = req.params.id
    const user = db.getUserById(userId)
    if (user) {
        res.json(user)
    }
    else if (!user) {
       res.status(404).json({ message: "The user with the specified ID does not exist." })
       } else {
        return res.status(500).json({ errorMessage: "The user information could not be retrieved."})
       }
   })
   

server.post('/api/users', function(req, res) {

    if (!req.body.name || !req.body.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    }  else if (req.body.name && req.body.bio) {
        const newUser = db.createUser({
            name: req.body.name,
            bio: req.body.bio
        })
        res.status(201).json(newUser)
    } else {
        return res.status(500).json({ errorMessage: "An error occured saving user to database." })
    }
    }
   )

   server.put("/api/users/:id", (req, res) => {

    const user = db.getUserById(req.params.id)

    if (!req.body.name || !req.body.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    } 
    else if (!user) {
       res.status(404).json({ message: "The user with the specified ID does not exist." })
       } else if (user) {
            const updatedUser = db.updateUser(user.id, {
                name: req.body.name || user.name,
                bio: req.body.bio || user.bio,
            })
            res.json(updatedUser)

       }
       else {
        return res.status(500).json({ errorMessage: "The user information could not be modified." })
       }
   })
   

   server.delete("/api/users/:id", (req, res) => {

    const user = db.getUserById(req.params.id)

    if (user) {
        db.deleteUser(user.id)
        res.status(204).end()
    }
    else if (!user) {
       res.status(404).json({ message: "The user with the specified ID does not exist." })
       } else {
        return res.status(500).json({ errorMessage: "The user could not be removed"})
       }
   })
   

server.listen(8000, () => console.log("\n==API is up ==\n"));




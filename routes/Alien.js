const express = require('express');
const router = express.Router();
const Alien = require('../models/aliens');
const verify = require('./verifyToken');

//Getting All
//Adding Auth token
router.get('/', verify, async(req,res)=>{
    try{
        const aliens = await Alien.find(); 
        res.json(aliens);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
});

//Getting One
router.get('/:id', getAlien, async(req,res)=>{
    res.send(res.alien.name)
});

//Deleting
router.delete('/:id', getAlien, async(req,res)=>{
    try{

        await res.alien.remove();
        res.json({message: 'deleted alien'});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
})

//Updating
router.patch('/:id', getAlien, async(req, res)=>{
    if(req.body.name != null){
        res.alien.name = req.body.name;
    }
    if(req.body.tech != null){
        res.alien.tech = req.body.tech;
    }

    try{
        const updatedAlien = await res.alien.save();
        res.json(updatedAlien);
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
})

//Creating
router.post('/', async(req,res)=>{
    const alien = new Alien({
        name: req.body.name,
        tech: req.body.tech,
        sub: req.body.sub
    })
    try{
        const a1 = await alien.save();
        res.status(201).json(a1);
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
});

async function getAlien(req, res, next){
    try{
        alien = await Alien.findById(req.params.id)
        if(alien == null){
            return res.status(404).json({message: 'Cannot find Alien'});
        }
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
    res.alien = alien;
    next();
}

module.exports = router;
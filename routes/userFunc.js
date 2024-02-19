const express = require('express')
const bcrypt = require('bcryptjs')
const userAuth = require('../middleware/userAuth')
const adminAuth = require('../middleware/adminAuth')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const eventModel = require('../models/eventModel')
const tokenModel = require('../models/tokenModel')
const bookingModel = require('../models/bookingModel')
let router = express()
router.post('/upcoming/events',userAuth, async (req, res) => { 
    
    try {
        //var id = req.user.user._id;'
        var datae = new Date()
        var upcomingEvents= await eventModel.find({status:"Active",from:{$gte:datae}})//gte-greater than or equal to and gtefrom mongodb
       console.log(upcomingEvents.length)
        res.status(200).json
                (
                    {
                        status: true,
                        msg:"upcoming events",
                        output:upcomingEvents
                    }
                )
            return
    }
    catch (e) {
        console.log(e)
    }
})
router.post('/detail/veiw',userAuth, async (req, res) => { 
    
    try {
        var {id} = req.body
        
        var veiwEvent= await eventModel.findOne({_id:id})
       
        res.status(200).json
                (
                    {
                        status: true,
                        output:veiwEvent
                    }
                )
            return
    }
    catch (e) {
        console.log(e)
    }
})
router.post('/booking',userAuth, async (req, res) => { 
    
    try {
        var uid = req.user.user._id;
        var {eId,numofseat,adultno,childno,name} = req.body
        var AdultAmount = 100;
        var ChildrenAmount = 50;


        if (eId == undefined || eId == null) {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "eventid is not given"
                    }
                )
            return
        }
        if (numofseat == undefined || numofseat == null ||typeof(numofseat)!=='number') {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "datatype error or number of seat is not given"
                    }
                )
            return
        }
        if (adultno == undefined || adultno == null||typeof(adultno)!=='number') {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "datatype error or number of adults is not given"
                    }
                )
            return
        }
        if (childno== undefined || childno == null ||typeof(childno)!=='number') {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "datatype error or number of children is not given"
                    }
                )
            return
        }
        if (name== undefined || name == null|| typeof(name)!=='string') {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "datatype error or name is not given"
                    }
                )
            return
        }
       /* if(typeof numofseat!=='number')
        {
            res.status(200).json
            (
                {
                    status: false,
                    msg: "invalid datatype for number of seat "
                }
            )
        }*/
        if (numofseat!==adultno+childno) {
            res.status(200).json
                (
                    {
                        status: true,
                        msg: "number of seat doesnt match given details"
                    }
                )
            return
        }
        

    var amt=(adultno*AdultAmount)+(childno*ChildrenAmount)

    if (amt== undefined || null ||typeof(amt)!=='number') {
        res.status(200).json
            (
                {
                    status: false,
                    msg: "Invalid datatype or amount is null"
                }
            )
        return
    }

    var eventexist= await eventModel.findOne({_id:eId})

    if (eventexist== undefined || eventexist == null) {
        res.status(200).json
            (
                {
                    status: false,
                    msg: "event doesnt exist in database"
                }
            )
        return
    }

        var book = new bookingModel()
        book.usersId=uid
        book.eventId=eId
        book.name=name
        book.numSeats=numofseat
        book.adult=adultno
        book.children=childno
        book.amount=amt
       

        await book.save()

       
       
        res.status(200).json
                (
                    {
                        status: true,
                        output:book
                    }
                )
            return
    }
    catch (e) {
        console.log(e)
    }
})
router.post('/user/list/veiw',userAuth, async (req, res) => { 
    
    try {
        var uid = req.user.user._id;
       
        var veiwEvent= await bookingModel.find({status:"Active",usersId:uid}).populate("eventId")
       
        res.status(200).json
                (
                    {
                        status: true,
                        output:veiwEvent
                    }
                )
            return
    }
    catch (e) {
        console.log(e)
    }
})

router.post('/admin/list/view',adminAuth, async (req, res) => { 
    
    try {
        //var uid = req.user.user._id;
        var{eventId}=req.body
        var adminviewEvent= await bookingModel.find({status:"Active",eventId:eventId}).populate({path:"usersId",select:{username:1}})
       
        res.status(200).json
                (
                    {
                        status: true,
                        output:adminviewEvent
                    }
                )
            return
    }
    catch (e) {
        console.log(e)
    }
})

router.post('/detail/list/view',userAuth, async (req, res) => { 
    
    try {
        var uid = req.user.user._id;
        var{bookId}=req.body
       
        var viewEvent= await bookingModel.findOne({_id:bookId}).populate("usersId").populate("eventId")
       
        res.status(200).json
                (
                    {
                        status: true,
                        output:viewEvent
                    }
                )
            return
    }
    catch (e) {
        console.log(e)
    }
})
router.post('/logout', async (req, res) => { 
    
    try {
        //var uid = req.user.user._id;
        var{token}=req.body
        var tokenexists= await tokenModel.deleteOne({status:"Active",token:token})
        
    //     if (token == undefined || token == null) {
    //         res.status(200).json
    //             (
    //                 {
    //                     status: false,
    //                     msg: "Token not given"
    //                 }
    //             )
    //         return
    //     }
    //     tokenexists.status='Delete'
    // await tokenexists.save()

            res.status(200).json
                (
                    {
                        status: true,
                        msg: "Logout Successful"
                    }
                )
            return
        
    }
    catch (e) {
        console.log(e)
    }
})
module.exports = router
const express = require('express')
const bcrypt = require('bcryptjs')
const userAuth = require('../middleware/userAuth')
const adminAuth = require('../middleware/adminAuth')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const eventModel = require('../models/eventModel')
const tokenModel = require('../models/tokenModel')

let router = express()

router.post('/user/data', async (req, res) => {
    try {
        var { role, userName, name, phone, email, password } = req.body;

        if (role == undefined || role == null) {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "Role is invalid"
                    }
                )
            return
        }

        if (userName == undefined || userName == null) {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "User Name is invalid"
                    }
                )
            return
        }
        if (name == undefined || name == null) {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "Name is invalid"
                    }
                )
            return
        }

        if (phone == undefined || phone == null) {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "Given phone is invalid"
                    }
                )
            return
        }
        if (email == undefined || email == null) {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "Email given is invalid"
                    }
                )
            return
        }
        if (password == undefined || password == null) {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "password is invalid"
                    }
                )
            return
        }
        var alreadyExists = await userModel.findOne({ phonenum: phone })//datbase:from body

        if (alreadyExists != null || alreadyExists != undefined) {
            res.status(200).json({
                status: false,
                msg: "phone number already exists"
            })
            return;
        }

        var encpass = await bcrypt.hash(password, 10)

        var users = new userModel()
        users.role = role;
        users.username = userName;
        users.name = name;
        users.phonenum = phone;
        users.emailid = email;
        users.password = encpass;

        await users.save()

        res.status(200).json({
            status: true,
            output: users
        })
        return
    }
    catch (e) {
        console.log(e)
    }
})

router.post('/login', async (req, res) => {
    try {
        var { phone, password } = req.body;

        if (phone == undefined || password == null) {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "phone number is invalid"

                    }
                )
            return
        }

        if (password == undefined || password == null) {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "password is invalid"

                    }
                )
            return
        }
        var userexists = await userModel.findOne({ phonenum: phone })

        if (userexists == null || userexists == undefined) {
            res.status(200).json({
                status: false,
                msg: "invalid credentials"
            })
            return;
        }

        if (await bcrypt.compare(password, userexists.password)) {
            var token = jwt.sign({ user: userexists }, "Test") //key generated as test for encoding and decoding
            console.log(token)
            var tokenData = new tokenModel()
            tokenData.userId = userexists._id
            tokenData.token = token

            await tokenData.save()

            res.status(200).json({
                status: true,
                token: token,
                msg: "Login successful"

            })
            return;
        }
        else {
            res.status(200).json({
                status: false,
                msg: "invalid credentials"
            })
            return;
        }

        var encpass = await bcrypt.hash(password, 10)
        return

    }
    catch (e) {
        console.log(e)
    }
})

router.post('/token', async (req, res) => {   //token validation
    try {
        var { token } = req.body
        if (token == undefined || token == null) {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "Token is invalid"
                    }
                )
            return
        }

        var tokenexists = await tokenModel.findOne({ token: token })//database:body

        if (tokenexists == null || tokenexists == undefined) {
            res.status(200).json({
                status: false,
                msg: "token doesnt match"
            })
            return;
        }
        else {
            res.status(200).json({
                status: true,
                msg: "token do exist"
            })
            return;
        }

    }
    catch (e) {
        console.log(e)
    }
})
router.post('/gettoken', async (req, res) => {
    try {
        var { get_token } = req.body;
        if (get_token == null || get_token == undefined) {
            res.status(200).json({
                status: false,
                msg: "did not get token "
            })
            return;

        }

        var tokenexists = await tokenModel.findOne({ token: get_token, status: "Active" }).populate("userId")
        if (tokenexists == null || tokenexists == undefined) {
            res.status(200).json({
                status: false,
                msg: "token doesn't exist in database "
            })
            return;
        }
        else {

            //     var userData = await userModel.findOne({_id:tokenexists.userId,status:"Active"})
            //     if(userData==null||userData==undefined)
            // {
            //     res.status(200).json({
            //         status:false,
            //         msg:"userdata not found "
            //     })
            //     return;
            //}
            res.status(200).json({
                status: true,
                msg: "userdata do exist",
                userData: tokenexists

            })
            return;
        }
    }
    catch (e) {
        console.log(e)
    }
})
router.post('/verifytoken/middleware', async (req, res) => {
    try {
        var { token } = req.body;
        if (token == null || token == undefined) {
            res.status(200).json({
                status: false,
                msg: "did not get token "
            })
            return;

        }
        var userr = jwt.verify(token, "Test")
        console.log(userr)
        return;
    }
    catch (e) {
        console.log(e)
    }
})
router.post('/user/profile', async (req, res) => {
    try {
        var { token } = req.body;
        if (token == null || token == undefined) {
            res.status(200).json({
                status: false,
                msg: "did not get token "
            })
            return;

        }
        else{
            var userr = jwt.verify(token, "Test")
        console.log(userr)
        res.status(200).json({
            status: true,
            data: userr
        })
        return;
        }
        
    }
    catch (e) {
        console.log(e)
    }
})
router.post('/user/profile/withtoken', userAuth,async (req, res) => {
    try {
        var { token } = req.body;
        if (token == null || token == undefined) {
            res.status(200).json({
                status: false,
                msg: "did not get token "
            })
            return;

        }
        else{
            var userr = jwt.verify(token, "Test")
        console.log(userr)
        res.status(200).json({
            status: true,
            data: userr
        })
        return;
        }
        
    }
    catch (e) {
        console.log(e)
    }
})



router.post('/user/me',adminAuth, async (req, res) => { //middleware comes btw url and code
    //checking own profile so admin auth
    try {
        
        res.status(200).json
                (
                    {
                        status: true,
                        msg: "Success"
                    }
                )
            return
    }
    catch (e) {
        console.log(e)
    }
})
router.post('/event/data',adminAuth, async (req, res) => {
    try {
        var { EName, from, to, venue, host } = req.body;

        if (EName == undefined || EName == null) {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "Event name is invalid"

                    }
                )
            return
        }

        if (from == undefined || from == null) {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "From Date is invalid"

                    }
                )
            return
        }
        if (to == undefined || to == null) {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "To date is invalid"

                    }
                )
            return
        }
        if (venue == undefined || venue == null) {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "venue is invalid"

                    }
                )
            return
        }

        if (host == undefined || host == null) {
            res.status(200).json
                (
                    {
                        status: false,
                        msg: "Host name is invalid"

                    }
                )
            return
        }

        var events = new eventModel()
        events.eventName = EName;
        events.from = from;
        events.to = to;
        events.venue = venue;
        events.host = host;

        await events.save()

        res.status(200).json({

            status: true,
            output: events

        })
        return

    }
    catch (e) {
        console.log(e)
    }
})
router.post('/event/edit',adminAuth, async (req, res) => { 

    try {
        var { EName, from, to, venue, host ,id} = req.body;
        if (id == null || id == undefined) {
            res.status(200).json({
                status: false,
                msg: "id not given "
            })
            return;
        }

        var eventexists = await eventModel.findOne({ _id: id})
        if (eventexists == null || eventexists == undefined) {
            res.status(200).json({
                status: false,
                msg: "event doesn't exist in database "
            })
            return;
        }
        if(EName!=null||EName!=undefined){
            eventexists.eventName=EName
        }
        if(from!=null||from!=undefined){
            eventexists.from=from
        }
        if(to!=null||to!=undefined){
            eventexists.to=to
        }
        if(venue!=null||venue!=undefined){
            eventexists.venue=venue
        }
        if(host!=null||host!=undefined){
            eventexists.host=host
        }
        await eventexists.save()



        res.status(200).json
                (
                    {
                        status: true,
                        output: eventexists
                    }
                )
            return
    }
    catch (e) {
        console.log(e)
    }
})
router.post('/event/list',adminAuth, async (req, res) => { 
    
    try {
        var displayList = await eventModel.find({status: "Active" })
        
        res.status(200).json
                (
                    {
                        status: true,
                        output:displayList
                    }
                )
            return
    }
    catch (e) {
        console.log(e)
    }
})
router.post('/event/view',adminAuth, async (req, res) => { 
    
    try {
        var {id} = req.body;
        if (id == null || id == undefined) {
            res.status(200).json({
                status: false,
                msg: "id not given "
            })
            return;
        }
        var eventVeiw = await eventModel.findOne({_id:id})
        console.log(eventVeiw)
        
        res.status(200).json
                (
                    {
                        status: true,
                        output:eventVeiw
                    }
                )
            return
    }
    catch (e) {
        console.log(e)
    }
})
router.post('/event/delete',adminAuth, async (req, res) => { 
    
    try {
        var {id} = req.body;
        var eventDelete = await eventModel.findOne({_id: id })
        eventDelete.status="Delete"
        await eventDelete.save()
        res.status(200).json
                (
                    {
                        status: true,
                        msg:"event Deleted"
                    }
                )
            return
    }
    catch (e) {
        console.log(e)
    }
})
module.exports = router
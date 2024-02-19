const userModel=require('../models/userModel')
const tokenModel=require('../models/tokenModel')
const jwt=require('jsonwebtoken')
module.exports = async function (req, res, next) //next-after return if functiong gives true move foward
{

    try {

        var token = req.body.token || req.query.token || req.headers.token;//query in gets

        // console.log('token: ',token)

        

        // var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

        // console.log(fullUrl)


        if (token) {

            try {

                var user = await jwt.verify(token, "Test");

                if (user) {

                    req.user = user;
                   // console.log(req.user.user._id)
                    var userdata = await userModel.findOne({ _id: req.user.user._id, role:"admin"}, { password: 0 });//dont take password and if 1 given get password
                    //console.log(userdata)

                    if ((userdata!=undefined||userdata!=null)) {

                        var checkToken = await tokenModel.findOne({ userId: req.user.user._id, token: token, status: 'Active' });

                        if (checkToken==undefined||checkToken==null) {

                            res.status(200).json({

                                status: false,

                                expired: true,

                                msg: 'Authentication failed'

                            });

                            return;

                        }

                        

                        req.user.user = userdata;

                        next();

                    }

                    else {

                        res.status(200).json({

                            status: false,

                            msg: 'Failed to find user.'

                        });

                        return;

                    }

                } else {

                    res.status(200).json({

                        status: false,

                        expired: true,

                        msg: 'Failed to authenticate token.'

                    });

                    return;

                }

            } catch (ex) {

                console.log(ex)

                res.status(200).json({

                    status: false,

                    expired: true,

                    msg: 'Your session has expired, please login again.',

                    ex: ex

                });

                return;

            }


        } else {

            res.status(200).json({

                status: false,

                expired: true,

                msg: 'No token provided.'

            });

            return;

        }


    } catch (e) {

        res.status(500).json({

            status: false,

            expired: true,

            msg: 'Something went wrong!!!',

            e: e

        });

    }

};
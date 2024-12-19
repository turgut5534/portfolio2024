const express = require('express')
const router = new express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth')
require('dotenv').config();

const User = require('../models/User')
const Setting = require('../models/Settings')

router.get('/login', async(req,res) => {
    res.render('admin/admin-login')
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({
            where: { email: email }
        });

        if (!user) {
            return res.status(400).send({ message: 'User not found' });
        }

        // Compare the password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).send({ message: 'Invalid credentials' });
        }

        // Create a JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email }, // Payload (user data you want to encode)
            process.env.SECRET_KEY, // Secret key
            { expiresIn: '1h' } // Token expiration time (optional)
        );

        res.cookie('token', token, {httpOnly:true})

        // Send the token as the response
        res.status(200).send({
            message: 'Login successful',
            token: token // Send the JWT token to the client
        });

    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'An error occurred during login' });
    }
});

router.post('/admin-save', async(req,res) => {

    try {

        const { email, password, key } = req.body

        if (key != process.env.SECRET_KEY) {
            return res.status(400).json({
                message: 'Incorrect key'
            })
        }

        const count = await User.count();

        if(count > 0) {
            return res.status(400).json({
                message: 'There is already an admin exists'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await User.create({
            email:email,
            password:hashedPassword
        })

        res.status(200).send()


    } catch(e) {
        console.log(e)
    }

})

router.get('/dashboard', auth, async(req,res) => {

    try{

        const settings = await Setting.findOne()

        res.render('admin/dashboard', {
            settings: settings
        })
    } catch(e) {
        console.log(e)
    }

})

router.post('/settings/maintanence', auth, async(req,res) => {

    try{

        const maintanance = req.body.maintananceName
        var message;

        const settings = await Setting.findOne()

        console.log(maintanance)

        if(maintanance) {
            settings.maintanence_enabled = 1
            message= 'Disable Maintanence'
        } else {
            settings.maintanence_enabled = 0
            message= 'Enable Maintanence'
        }

        await settings.save()

        res.status(200).send(message)
        
    } catch(e) {
        console.log(e)
        res.status(400).json( {
            message: 'An error occurred'
        })
    }

})

router.post('/settings/mails', auth, async(req,res) => {

    try{

        const mails = req.body.mailSwitch
        var message;

        const settings = await Setting.findOne()

        console.log(mails)

        if(mails) {
            settings.mails_enabled = 1
            message= 'Disable Mails'
        } else {
            settings.mails_enabled = 0
            message= 'Allow Mails'
        }

        await settings.save()

        res.status(200).send(message)
        
    } catch(e) {
        console.log(e)
        res.status(400).json( {
            message: 'An error occurred'
        })
    }

})

module.exports = router
const express = require('express')
const path = require('path')
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();
const validator = require('validator')
const rateLimit = require('express-rate-limit');
const visitorInfoMiddleware = require('./src/middlewares/collectdata');
const requestIp = require('request-ip');
const adminRouter = require('./src/routers/adminRouter')
const cookieParser = require('cookie-parser');
const maintance = require('./src/middlewares/maintanence');
const Setting = require('./src/models/Settings');

const app = express()

const viewsDir = path.join(__dirname, '/src/views')
const publicDir = path.join(__dirname, 'public/')

app.set('view engine', 'ejs')
app.set('views', viewsDir)
// app.set('views', adminViewsDir)
app.set('trust proxy', 1)

app.use(express.static(publicDir))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const port = process.env.PORT || 8000

app.use('/space', adminRouter)

app.use(maintance)
app.use(requestIp.mw());
app.use(visitorInfoMiddleware);

app.get('/' ,  async (req,res) => {
    try{
        const setting= await Setting.findOne()
        res.render('index', {setting})
    } catch{
        console.log(e)
    }
   

})

const emailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests! Please try again later.',
    headers: true, // Send rate limit info in headers
});



const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com', // Namecheap's SMTP host
    port: 587, // Port for STARTTLS
    secure: false, // Use true for port 465, false for other ports
    auth: {
      user: 'info@turgutsalgin.com', // Your full email address
      pass: process.env.MAIL_PASSWORD, // Use your password securely
    },
  });

app.use('/contact', emailLimiter);

app.post('/contact', async(req,res) => {
    
    try{

        console.log('Sending')
        const { name, email, subject, message, "g-recaptcha-response": token} = req.body;

        if (!token) {
            return res.status(400).send("Please complete the CAPTCHA.");
        }

        if(!validator.isEmail(email)) {
            return res.status(400).send('Please enter a valid email address.');
        }

        if (validator.isEmpty(validator.trim(name)) || 
            validator.isEmpty(validator.trim(email)) || 
            validator.isEmpty(validator.trim(subject)) || 
            validator.isEmpty(validator.trim(message))) {
            return res.status(400).send('All fields are required and cannot be just spaces.');
        }

        const mailOptions = {
            from: `info@turgutsalgin.com`,
            to: 'turgutsalgin3455@gmail.com',
            subject: subject,
            html: `
            <h3>Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong> ${message}</p>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
              return res.status(500).send('Error occurred while sending the message.');
            }
            res.status(200).send('Your message has been sent. Thank you!');
        });

        res.status(200).send('Your message has been sent. Thank you!');
    } catch(e) {
        console.log(e)
    }
})

app.get('*', (req,res) => {
    res.render('404')
})

app.listen(port, () => {
    console.log(`App is running on ${port}`)
})
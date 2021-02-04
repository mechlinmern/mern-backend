const router = require('express').Router();
const User = require('../../models/user.model');
const randomstring = require('randomstring');
const nodemailer = require("nodemailer");
const config = require('config');

router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.json(err))
});

router.route('/add').post((req, res) => {
    const {name, email, gender, contact, profile, experience, duration} = req.body;

    if(!name || !email || !gender || !contact || !profile || !experience || !duration) return res.json({
        msg: 'Please enter all fields'
    });

    if(isNaN(parseInt(contact))) return res.json({msg: 'Contact must be in integer type'});
    
    if(isNaN(parseInt(duration))) return res.json({msg: 'Duration must be in integer type'});

    User.findOne({email: email})
        .then(user => {
            if(user) return res.json({msg: 'User already exists'});
        })
        .catch(err => res.json(err));

    const newUser = new User({
        name,
        email,
        gender,
        contact: parseInt(contact),
        profile,
        experience,
        duration: parseInt(duration),
        password: null,
        status: null
    });

    newUser.save()
        .then(user => res.json({
            user:{
                id: user.id,
                name: user.name
            }
        }))
        .catch(err => res.json(err))
});

router.route('/update/:id').post((req, res) => {
    const {name, email, gender, contact, profile, experience, duration} = req.body;

    User.findById(req.params.id)
        .then(user => {
            user.name = name,
            user.email = email,
            user.gender = gender,
            user.contact = contact,
            user.profile = profile,
            user.experience = experience,
            user.duration = duration,
            user.password = user.password,
            user.status = user.status

            user.save()
                .then(() => res.json({msg: 'User details updated'}))
                .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
});

router.route('/sendquiz/:id').post( async (req, res) => {
    const password = randomstring.generate({
        length: 10,
        charset: 'alphanumeric'
    })

    const {name} = req.body;

    try {
        let user = await User.findById(req.params.id);

        if(user.status == 'Quiz Sent') {
            res.json({msg: `Quiz already sent to ${user.name}`})
        }
        else {
            {
                user.name = user.name,
                user.email = user.email,
                user.gender = user.gender,
                user.contact = user.contact,
                user.profile = user.profile,
                user.experience = user.experience,
                user.duration = user.duration,
                user.password = password,
                user.status = 'Quiz Sent'
            }

            let transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: config.get('etherealUsername'), // generated ethereal user
                    pass: config.get('etherealPassword'), // generated ethereal password
                },
            });

            let msg = {
                from: `"${name}" <hr@mechlintech.com>`, // sender address
                to: `${user.email}`, // list of receivers
                subject: "Online quiz credentials", // Subject line
                text: "http://localhost:3000/user_login", // plain text body
            }
                
            // send mail with defined transport object
            let info = await transporter.sendMail(msg);

            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                
            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

            user.save();
            res.json({msg: `Quiz sent to ${user.name}`})
        }

    } catch (error) {
        res.json({error})
    }
});

router.route('/find').post(async (req, res) => {
    try {
        const {name} = req.body;
        let regx = new RegExp(name, 'i');
        let users = await User.find({name: regx});
        res.json(users);
    } catch (err) {
        res.json(err);
    }
})

router.route('/delete/:id').delete((req, res) => {
    User.findByIdAndRemove({_id: req.params.id})
        .then(user => {
            if(user) return res.json(user);
        });
});

module.exports = router;
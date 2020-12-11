const router = require('express').Router();
const User = require('../../models/user.model');
const randomstring = require("randomstring");

router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.json(err))
});

router.route('/add').post((req, res) => {
    const {name, email, contact, profile, experience, duration} = req.body;

    if(!name || !email || !contact || !profile || !experience || !duration) return res.json({
        msg: 'Please enter all fields'
    });

    if(isNaN(parseInt(contact))) return res.json({msg: 'Contact must be in integer type'});
    
    if(isNaN(parseInt(duration))) return res.json({msg: 'Duration must be in integer type'});

    User.findOne({email: email})
        .then(user => {
            if(user) return res.json({msg: 'User already exists'});
        })

    const newUser = new User({
        name,
        email,
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
    const {name, email, contact, profile, experience, duration} = req.body;

    User.findById(req.params.id)
        .then(user => {
            user.name = name,
            user.email = email,
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

router.route('/quiz/:id').post((req, res) => {
    const password = randomstring.generate({
        length: 10,
        charset: 'alphanumeric'
    })

    User.findById(req.params.id)
        .then(user => {
            user.name = name,
            user.email = email,
            user.contact = contact,
            user.profile = profile,
            user.experience = experience,
            user.duration = duration,
            user.password = password,
            user.status = 'Quiz Sent'

            user.save()
                .then(() => res.json({msg: 'User details updated'}))
                .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
});

router.route('/find').post((req, res) => {
    const { name } = req.body;

    User.findOne({name: name})
        .then(user => {
            if(user) return res.json(user);
        });
});

router.route('/delete/:id').delete((req, res) => {
    User.findByIdAndRemove({_id: req.params.id})
        .then(user => {
            if(user) return res.json(user);
        });
});

module.exports = router;
const router = require('express').Router();
const Admin = require('../../models/admin.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

router.route('/').post((req, res) => {
    const {username, password} = req.body;
    
    if(!username || !password) return res.json({msg: 'Please enter all fields'});

    Admin.findOne({username: username})
        .then(admin => {
            if(!admin) return res.json({msg: 'User does not exists'});

            bcrypt.compare(password, admin.password)
            .then(isMatch => {
                if(!isMatch) return res.json({msg: 'Invalid credentials'});

                jwt.sign(
                    {id: admin.id},
                    config.get('jwtSecret'),
                    {expiresIn: 3600},
                    (err, token) => {
                        if(err) throw err;

                        res.json({
                            token,
                            admin: {
                                id: admin.id,
                                username: admin.username,
                                gender: admin.gender
                            }
                        })
                    }
                )
            })
        })
});

router.route('/add').post((req, res) => {
    const {username, gender, password} = req.body;

    if(!username || !gender || !password) return res.status(400).json({msg: 'Please enter all fields'});

    Admin.findOne({username: username})
        .then(admin => {
            if(admin) return res.status(400).json({msg: 'User already exists'});
        })

    const newAdmin = new Admin({
        username, 
        gender,
        password
    })

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newAdmin.password, salt, (err, hash) => {
            if(err) throw err;

            newAdmin.password = hash;
            newAdmin.save()
                .then(admin => {
                    jwt.sign(
                        {id: admin.id},
                        config.get('jwtSecret'),
                        {expiresIn: 3600},
                        (err, token) => {
                            if(err) throw err;

                            res.json({
                                token,
                                admin: {
                                    id: admin.id,
                                    username: admin.username
                                }
                            })
                        }
                    )
                })
        })
    })
});

module.exports = router;
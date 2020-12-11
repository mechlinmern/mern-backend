const express = require('express');
const router = require('express').Router();
const fileUpload = require('express-fileupload');
const csvtojson = require('csvtojson');
const Quiz = require('../../models/quiz.model');
const app = express();

app.use(fileUpload());

router.route('/').post((req, res) => {
    if(req.files === null) return res.json({msg: 'No file uploaded'});

    const file = req.files.file;

    file.mv(`${__dirname}/uploads/csvs/${file.name}`, err => {
        if(err) return res.json(err);
    });

    const csvfilePath = `uploads/csvs/${file.name}`;

    csvtojson()
        .fromFile(csvfilePath)
        .then(jsonData => {
            if(jsonData) {
                let i = 0;
                while(i < jsonData.length()) {
                    const newQuestion = new Quiz({
                        question: jsonData[i].question,
                        a: jsonData[i].a,
                        b: jsonData[i].b,
                        c: jsonData[i].c,
                        d: jsonData[i].d,
                        r: jsonData[i].r
                    });

                    newQuestion.save()
                        .then(() => {
                            res.json({msg: `Question ${i} added successfully`});
                            i++;
                        })
                        .catch(err => res.json(err))
                }
            }  
        })
});

module.exports = router;

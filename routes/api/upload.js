const router = require('express').Router();
const csvtojson = require('csvtojson');
const Quiz = require('../../models/quiz.model');

router.route('/').post((req, res) => {
    const file = req.files.file;

    file.mv(`${__dirname}/uploads/csvs/${file.name}`, err => {
        if(err) return res.json(err);
        res.json({fileName: file.name, filePath: `${__dirname}/uploads/${file.name}`});
    });

    const csvfilePath = `${__dirname}/uploads/csvs/${file.name}`;

    csvtojson()
        .fromFile(csvfilePath)
        .then(jsonData => {
            if(jsonData) {
                let i = 0;
                while(i < jsonData.length) {
                    const newQuestion = new Quiz({
                        question: jsonData[i].question,
                        a: jsonData[i].a,
                        b: jsonData[i].b,
                        c: jsonData[i].c,
                        d: jsonData[i].d,
                        r: jsonData[i].r
                    });

                    newQuestion.save()
                        .then(res => {
                            console.log(res);
                        })
                        .catch(err => console.log(err))
                    i++;
                }
            }  
        })
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../../models/user.model');
const IndexUser = require('../../models/index.user.model');
const multer = require('multer');
const AWS = require('aws-sdk');
const AwsConstants = require('../../constants/aws');
const multerS3 = require('multer-s3');
const uuid = require('uuid');
const Project = require('../../models/project.model');


const s3 = new AWS.S3({
    accessKeyId: AwsConstants.ID,
    secretAccessKey: AwsConstants.SECRET
});

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: AwsConstants.BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, "images/content/" + uuid.v1())
        }
    })
});

router.route('/').post(
    upload.single({ name: "coverPhoto", maxCount: 1 }), (req, res) => {

        const userId = req.body.userId;
        const indexUserId = req.body.indexUserId;
        const selectedPosts = [];
        const title = req.body.title ? req.body.title : null;
        const overview = req.body.overview ? req.body.overview : null;
        const pursuitCategory = req.body.pursuitCategory ? req.body.pursuitCategory : null;
        const startDate = req.body.startDate ? req.body.startDate : null;
        const endDate = req.body.endDate ? req.body.endDate : null;
        const isComplete = req.body.isComplete ? req.body.isComplete : null;
        const minDuration = req.body.minDuration ? req.body.minDuration : null;
        const coverPhotoURL = req.files ? req.files.coverPhoto[0].location : null;
        console.log("is it");
        console.log(req.body);
        for (const post of (req.body.selectedPosts)) {
            selectedPosts.push(post._id);
        }

        const newProject = new Project.Model({
            title: title,
            overview: overview,
            pursuit: pursuitCategory,
            start_date: startDate,
            end_date: endDate,
            is_complete: isComplete,
            min_duration: minDuration,
            cover_photo_url: coverPhotoURL,
            post_ids: selectedPosts,
        });

        let resolvedIndexUser = IndexUser.Model.findById(indexUserId).then(result => {
            let user = result;
            for (const pursuit of user.pursuits) {
                if (pursuit.name === newProject.pursuit) {
                    console.log("Yes");

                    pursuit.num_projects++;
                }
            } 
            console.log("here");
            // console.log(user.pursuits);


            return user;
        });
        let resolvedUser = User.Model.findById(userId).then((result => {
            let user = result;
            for (const pursuit of user.pursuits) {
                if (pursuit.name === newProject.pursuit) {
                    console.log("Yes2");
                    pursuit.projects.push(newProject);
                }
            }
            console.log("here2");
            // console.log(user.pursuits);
            return user;

        }));

        return Promise.all([resolvedIndexUser, resolvedUser ])
        .then((result) => {
            console.log(result);
            console.log("here 3");
            const savedIndexUser = result[0].save();
            const savedUser = result[1].save();

            return (Promise.all([savedIndexUser, savedUser]));
        })
            .then((result) => {
                console.log(result);
                console.log("Saved Entries");
                res.status(201).send();
            })
            .catch(err => {
                console.log(err);
                res.status(500).send();
            })
    });

module.exports = router;


const { Router } = require ('express')

const controllers = require('../controllers/index')
const config= require('../config')

const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, config.imageFolder)
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + '.jpg')
    }
})

const uploads = multer({
    storage: storage,
    limits: {
        // fileSize: 2000000,
    }
})

const router = Router()

router.post('/upload', uploads.single('image'), controllers.post.upload) //activamos el multipart para posts
router.get('/recentUploads', controllers.post.recentUploads)
router.get('/stats', controllers.post.stats)
router.get('/mostPopular', controllers.post.mostPopular)
router.get('/details/:postId', controllers.post.details)
router.delete('/remove', controllers.post.remove)
router.post('/like', controllers.post.like)
router.post('/view', controllers.post.view)


module.exports = router
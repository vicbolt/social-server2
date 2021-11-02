const { Router } = require ('express')

const router = Router()

const controllers = require('../controllers/index')

router.get('/latestComments', controllers.comment.latestComments)
router.post('/create', controllers.comment.create)


module.exports = router
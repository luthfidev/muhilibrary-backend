const router = require('express').Router()
const usersController = require('../controllers/users')
const validator = require('../utils/validator')
const verify = require('../utils/verifyToken')
const checkRole = require('../utils/roles')
const upload = require('../utils/multer')


router.get('/', verify, checkRole('admin'), usersController.getAllUsers)
router.post('/', verify, checkRole('admin'), usersController.createUser)
router.get('/:id', verify, checkRole('admin'), usersController.getDetailUser)
router.post('/biodata', verify, checkRole('admin' && 'user'), upload.single('picture'), validator.createUserDetail, usersController.createUserDetail)


module.exports = router
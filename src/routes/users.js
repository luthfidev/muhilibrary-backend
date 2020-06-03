const router = require('express').Router()
const usersController = require('../controllers/users')
const verify = require('../utils/verifyToken')
const checkRole = require('../utils/roles')
const upload = require('../utils/multer')

router.use(verify)
  .get('/',
    checkRole('admin'),
    usersController.getAllUsers)
  .post('/',
    checkRole('admin'),
    usersController.createUser)
  .delete('/:id',
    checkRole('admin'),
    usersController.deleteUser)
  .get('/detail/:id',
    usersController.getDetailUser)
  .patch('/biodata',
    upload.single('picture'),
    usersController.updateUserDetail)

module.exports = router

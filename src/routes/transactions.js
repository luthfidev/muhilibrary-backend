const router = require('express').Router()
const checkRole = require('../utils/roles')
const verify = require('../utils/verifyToken')
const transactionController = require('../controllers/transactions')
const validator = require('../utils/validator')


router.use(verify)
      .get('/',
            checkRole('admin'), 
            transactionController.getAllTransactions)
      .get('/:id',
            transactionController.getTransactionDetail)
      .get('/userstatus',
            transactionController.getTransactionDetailUser)
      .post('/', 
            validator.transaction,
            transactionController.createTransaction)
      .post('/user', 
            validator.userTransaction,
            transactionController.createUserTransaction)
      .patch('/:id', 
            validator.transaction,
            transactionController.updateTransaction)
      .delete('/:id', 
            transactionController.deleteTransaction)

module.exports = router
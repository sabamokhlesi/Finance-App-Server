const express = require('express');
const { body } = require('express-validator/check');

const budgetController = require('../controllers/budget-manager');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /budget-manager/transactions
router.get('/transactions', isAuth, budgetController.getTransactions);

// POST /budget-manager/transaction
router.post(
  '/transaction',
  isAuth,
  [
    body('title').trim().isLength({ min: 1 }),
    body('amount').trim().isLength({ min: 1 }),
    body('category').trim().isLength({ min: 1 }),
    body('date').trim().isLength({ min: 1 }),
    body('person').trim().isLength({ min: 1 }),
    body('type').trim().isLength({ min: 1 })
  ],
  budgetController.createTransaction
);

router.get('/transaction/:transactionId', isAuth, budgetController.getTransaction);

router.put(
  '/transaction/:transactionId',
  isAuth,
  [
    body('title').trim().isLength({ min: 1 }),
    body('amount').trim().isLength({ min: 1 }),
    body('category').trim().isLength({ min: 1 }),
    body('date').trim().isLength({ min: 1 }),
    body('person').trim().isLength({ min: 1 }),
    body('type').trim().isLength({ min: 1 })
  ],
  budgetController.updateTransaction
);

router.delete('/transaction', isAuth, budgetController.deleteTransaction);

module.exports = router;

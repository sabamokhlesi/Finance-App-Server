const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator/check');

const Transaction = require('../models/transaction');
const User = require('../models/user');
const { default: Axios } = require('axios');

exports.createTransaction = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    const title = req.body.title;
    const amount = req.body.amount;
    const type = req.body.type;
    const category = req.body.category;
    const date = req.body.date;
    const person = req.body.person;
    const note = req.body.note;
    let userId = req.body.userId
    const transaction = new Transaction({title: title,amount: amount,type: type,category:category,date:date,person:person,note:note,userId: userId});
    transaction.save().then(result => {return User.findById(userId);})
      .then(user => {
        userId = user;
        user.transactions.push(transaction);
        return user.save();
      })
      .then(result => {
        res.status(201).json({
          message: 'transaction added successfully!',
          transaction: transaction,
          userId: { _id: userId._id }
        });
      })
      .catch(err => {
        if (!err.statusCode) {err.statusCode = 500;}
        next(err);
      });
  };


  exports.deleteTransaction = (req, res, next) => {
    const transactionId = req.params.transactionId;
    Transaction.findById(transactionId)
      .then(transaction => {
        if (!transaction) {
          const error = new Error('Could not find transaction.');
          error.statusCode = 404;
          throw error;
        }
        if (transaction.userId.toString() !== req.params.userId) {
          const error = new Error('Not authorized!');
          error.statusCode = 403;
          throw error;
        }
        // Check logged in user
        // clearImage(post.imageUrl);
        return Transaction.findByIdAndRemove(transactionId);
      })
      .then(result => {
        return User.findById(req.params.userId);
      })
      .then(user => {
        user.transactions.pull(transactionId);
        return user.save();
      })
      .then(result => {
        res.status(200).json({ message: 'Deleted transaction.' });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };
  
//   const clearImage = filePath => {
//     filePath = path.join(__dirname, '..', filePath);
//     fs.unlink(filePath, err => console.log(err));
//   };

exports.updateTransaction = (req, res, next) => {
    const transactionId = req.params.transactionId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    const title = req.body.title;
    const amount = req.body.amount;
    const type = req.body.type;
    const category = req.body.category;
    const date = req.body.date;
    const person = req.body.person;
    const note = req.body.note;
    const userId = req.body.userId
    // if (req.file) {
    //   imageUrl = req.file.path;
    // }
    // if (!imageUrl) {
    //   const error = new Error('No file picked.');
    //   error.statusCode = 422;
    //   throw error;
    // }
    Transaction.findById(transactionId)
      .then(transaction => {
        if (!transaction) {
          const error = new Error('Could not find transaction.');
          error.statusCode = 404;
          throw error;
        }
        if (transaction.userId.toString() !== req.userId) {
          const error = new Error('Not authorized!');
          error.statusCode = 403;
          throw error;
        }
        // if (imageUrl !== post.imageUrl) {
        //   clearImage(post.imageUrl);
        // }
        transaction.title = title;
        transaction.amount = amount;
        transaction.type = type;
        transaction.category = category;
        transaction.date = date;
        transaction.person = person;
        transaction.note = note;
        transaction.userId= userId;
        return transaction.save();
      })
      .then(result => {
        res.status(200).json({ message: 'transaction updated!', transaction: result });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };

  exports.getTransaction = (req, res, next) => {
    const transactionId = req.params.transactionId;
    Transaction.findById(transactionId)
      .then(transaction => {
        if (!transaction) {
          const error = new Error('Could not find transaction.');
          error.statusCode = 404;
          throw error;
        }
        res.status(200).json({ message: 'transaction fetched.', transaction: transaction });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };

  exports.getTransactions = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const userId = req.query.userId
    const perPage = 50;
    let totalItems;
    Transaction.find({userId:userId})
      .countDocuments()
      .then(count => {
        totalItems = count;
        return Transaction.find()
          .skip((currentPage - 1) * perPage)
          .limit(perPage);
      })
      .then(transactions => {
        res.status(200).json({
          message: 'Fetched transactions successfully.',
          transactions: transactions,
          totalItems: totalItems
        });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };
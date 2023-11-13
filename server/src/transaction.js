// testing file for financial calculations, including interest and balance updates

const express = require('express');
const router = express.Router();
const database = require('./database.js');

// Basing calcs on a Simple interest formula where the assumption is that all %interest rates
// are given in APR format. Note: This in function works as compounding interest since we add it in monthly
// looking into writing a compound projection if we have time

// $1,000 Balance x 12% APR (.12) x .083 (1 Year / 12 Months = .083) = 9.96

// Compounded: Yearly = 1
//             Monthly = .083
//             Daily   = .0027



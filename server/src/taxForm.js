const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const express = require('express');
const router = express.Router();
const database = require('./database.js');

const taxYear = '2023'






// API Endpoint to Generate 1099 Form
router.get('/1099form', async (req, res) => {
    try {
        
        let accountID = req.query.AccountID;
        let account = await database.getAccount_(accountID);
        account = account[0][0];
        console.log(account);
        let user = await database.getUser(account.UserID);
        user = user[0][0];
        console.log(user);

      // Replace 'path/to/your/file.pdf' with the actual path to your PDF file
      const pdfPath = 'src/1099int.pdf';
  
      // Read the PDF file as a Buffer
      const pdfBytes = fs.readFileSync(pdfPath);
  
      // Load existing PDF
      const pdfDoc = await PDFDocument.load(pdfBytes);
  
      // Get the form fields
      const form = pdfDoc.getForm();

      
  
      // Define Each text field
        const payerRTN = form.getTextField('payerRTN');
        const interestIncome = form.getTextField('interestIncome');
        const twoDigitYear = form.getTextField('twoDigitYear');
        const withdrawalPenalty = form.getTextField('withdrawalPenalty');
        const interestOnBonds = form.getTextField('interestOnBonds');
        const incomeTaxWithheld = form.getTextField('incomeTaxWithheld');
        const investmentExpenses = form.getTextField('investmentExpenses');
        const foreignTaxPaid = form.getTextField('foreignTaxPaid');
        const foreignCountry = form.getTextField('foreignCountry'); // USA only ?
        const privateBondInterest = form.getTextField('privateBondInterest'); // we do not offer bond accounts
        const marketDiscount = form.getTextField('marketDiscount'); 
        const bondPremium = form.getTextField('bondPremium'); // we do not offer bond accounts
        const bondPremiumTreasury = form.getTextField('bondPremiumTreasury'); // we do not offer bond accounts
        const bondPremiumTaxExempt = form.getTextField('bondPremiumTaxExempt'); // we do not offer bond accounts
        const taxCredit = form.getTextField('taxCredit');
        const state = form.getTextField('state');
        const stateID = form.getTextField('stateID');
        const stateTaxWithheld = form.getTextField('stateTaxWithheald');
        const payerAddress = form.getTextField('payerAddress');
        const payerTIN = form.getTextField('payerTIN');
        const recipientTIN = form.getTextField('recipientTIN');
        const recipientName = form.getTextField('recipientName');
        const recipientAddress = form.getTextField('recipientAddress');
        const cityStateZip = form.getTextField('cityStateZip');
        const accountNumber = form.getTextField('accountNumber');

        // Setting Bank Info + Misc Info
        payerRTN.setText('495901536') // Bank Routing number, Made Up
        payerAddress.setText('\tSummit Financial \n\t301 Sparkman Dr NW \n\tHuntsville, AL 35899')
        payerTIN.setText('12-0213122') // Bank TIN, Made up
        twoDigitYear.setText(taxYear.slice(-2));
        state.setText('AL'); // State for Bank
        stateID.setText('123123'); // State ID number for Bank, Made up

        // Setting Account Information
        accountNumber.setText(String(account.AccountID));
        interestIncome.setText(String(await database.sumInterestForYearAndAccount(taxYear,accountID)));
        

        //Setting User Information
        recipientTIN.setText(String(user.SSN))
        recipientName.setText(String(user.FirstName + ' ' + user.LastName).toUpperCase());
        recipientAddress.setText(String(user.Street + ', ' + user.Street2).toUpperCase());
        cityStateZip.setText(String("\t " + user.City + ",\t " + user.State + "\t " + user.ZIP).toUpperCase());

        // Unused Fields
        withdrawalPenalty.setText('0.00');
        interestOnBonds.setText('0.00');
        incomeTaxWithheld.setText('0.00');
        investmentExpenses.setText('0.00');
        foreignTaxPaid.setText('0.00');
        stateTaxWithheld.setText('0.00');







        form.flatten();
      // Save the modified PDF as a buffer
      const modifiedPdfBytes = await pdfDoc.save();
      // Send the modified PDF as the response
      res.contentType('application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="1099form.pdf"');
      res.end(modifiedPdfBytes, 'binary');
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

  
  
  module.exports = router;


const express = require('express')
const router = express.Router()
const session = require('express-session');
const axios = require('axios')
const formidable = require('formidable');
const fs = require('fs')
const csv = require('csv-parser')

router.get('/', async (req, res) => {
    const config_xero = {
        headers: { 
                    'Authorization': 'Bearer ' + req.session.xero_access_token,
                    'Xero-tenant-id': req.session.tenantId}
    }
    
    const bankTransactions = await axios.get('https://api.xero.com/api.xro/2.0/BankTransactions', config_xero)
    
    res.send(bankTransactions.data)
    
    
})

router.get('/post', async (req, res) => {
    const config_xero = {
        headers: { 
                    'Authorization': 'Bearer ' + req.session.xero_access_token,
                    'Xero-tenant-id': req.session.tenantId}
    }
    
    console.log(config_xero)
    
    const bankTrans = {
        
         "BankTransactions": [

  
         ]  
    }
    
    try{
        const bankTransactions = await axios.post('https://api.xero.com/api.xro/2.0/BankTransactions', bankTrans, config_xero)
    
    res.send(bankTransactions.data)
    } catch (err){
        res.send('error' + err)
}
    
    
    
    
})

router.post('/', (req, res) => {
    console.log('Got something')
      const form = formidable({ multiples: true });
 
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    console.log({ fields, files });
      
      const results=[];
fs.createReadStream(files.myFile.path)
    .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log(results);
    
    const bankTransactions = []
console.log(results.length)

results.forEach((booger)=> {

    
            const fee =({
Type: `${booger.type}`,
Contact: { 
    Name: `${booger.contact}` 
  },
Date: `${booger.date}`,
LineAmountTypes: 'Inclusive',
LineItems: [{
     UnitAmount: `${booger.amount}`,
     Description: `${booger.description}`,
     AccountCode: `${booger.account_code}`,
     TaxType: `${booger.TaxType}`


}],
BankAccount: { 
    Code: `${booger.bank_account_code}`
  }

})
//   JSON.parse(fee)     
   bankTransactions.push(fee) 
})
    
  console.log(bankTransactions)
    
    const formatted = JSON.stringify(bankTransactions)
    
    const config_xero = {
        headers: { 
                    'Authorization': 'Bearer ' + req.session.xero_access_token,
                    'Xero-tenant-id': req.session.tenantId,
                    'Content-Type': 'application/json'}
    }
    
  console.log(formatted)
    
//    const xeroFormat = { BankTransactions: formatted}
    const xeroFormat = { BankTransactions: bankTransactions}
    const xeroFormatJSON = JSON.stringify(xeroFormat)
    
    console.log(xeroFormatJSON)

    
    
    
    axios.post('https://api.xero.com/api.xro/2.0/BankTransactions', xeroFormatJSON, config_xero)
        .then((response) => {res.status(200).send('Bank trans sent');
                            console.log(response.data)})
    .catch((err) => {
        console.log('error' + err)
        res.status(400).send('Bank trans not sent. Error')
}) 
  })
})
})

module.exports = router
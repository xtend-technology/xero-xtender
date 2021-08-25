const express = require('express')
const router = express.Router()
const session = require('express-session');
const axios = require('axios')

router.get('/', async (req, res) => {
    const config_xero = {
        headers: { 
                    'Authorization': 'Bearer ' + req.session.xero_access_token,
                    'Xero-tenant-id': req.session.tenantId}
    }
    try{
       const customers = await axios.get('https://api.xero.com/api.xro/2.0/Contacts?where=IsCustomer==true&order=Name', config_xero)
       
       
    
    res.status(200).json(customers.data) 
    } catch (err) {
        res.status(400).send(err)
    }
    
    
    
})

router.get('/:id', async (req, res) => {
    const config_xero = {
        headers: { 
                    'Authorization': 'Bearer ' + req.session.xero_access_token,
                    'Xero-tenant-id': req.session.tenantId}
    }
    try{
       const customers = await axios.get(`https://api.xero.com/api.xro/2.0/Contacts/${req.params.id}`, config_xero)
       
       
    
    res.status(200).json(customers.data) 
    } catch (err) {
        res.status(400).send(err)
    }
    
    
    
})

router.get('/length/:page', async (req, res) => {
    const config_xero = {
        headers: { 
                    'Authorization': 'Bearer ' + req.session.xero_access_token,
                    'Xero-tenant-id': req.session.tenantId}
    }
    try{
       const customers = await axios.get(`https://api.xero.com/api.xro/2.0/Contacts?where=IsCustomer==true&order=Name&page=${req.params.page}`, config_xero)
       
       
    
    res.status(200).json(customers.data) 
    } catch (err) {
        res.status(400).send(err)
    }
    
    
    
})

module.exports = router
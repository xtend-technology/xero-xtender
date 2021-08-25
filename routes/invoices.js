const express = require('express')
const router = express.Router()
const session = require('express-session');
const axios = require('axios')
const fs = require('fs');

router.get('/', async (req, res) => {
    
    //Having all kinds of issues fixed eventually with responseType = array buffer. Removing array buffer returns the scrambled pdf raw code to the browser / console
    const config_xero = {
//        encoding: null,
//        responseType: 'stream',
        responseType: 'arraybuffer',
        headers: { 
                    'Authorization': 'Bearer ' + req.session.xero_access_token,
                    'Xero-tenant-id': req.session.tenantId,
                    'Content-type': 'application/pdf',
                    'Accept': 'application/pdf'}
    }

        const inv = await axios.get('https://api.xero.com/api.xro/2.0/Invoices/5aadcd34-01a9-4b8d-a2bb-d7cc1de9fa45', config_xero)
        
        console.log(inv.data)
        
        res.header('Content-Disposition', 'attachment; filename=test.pdf')
        res.header('Content-Type', 'application/pdf')
        res.send(inv.data)

        
        
    
})

router.get('/multiple', (req, res) => {
    const invoices = ['8694c9c5-7097-4449-a708-b8c1982921a4', '86d6e00f-ef56-49f7-9a54-796ccd5ca057', 'f5832195-5cd3-4660-ad3f-b73d9c64f263' ]
    
    invoices.forEach((booger) => {
        axios.get(`http://localhost:5000/invoices/pdf/${booger}`)
        .then((response) => {
            console.log(response)
            .catch((err) => {
                console.log(err)
            })
        })
    })
})

//PDF invoices returned
router.get('/pdf/:invoiceid', async (req, res) => {
    
    //Having all kinds of issues fixed eventually with responseType = array buffer. Removing array buffer returns the scrambled pdf raw code to the browser / console
    const config_xero = {
//        encoding: null,
//        responseType: 'stream',
        responseType: 'arraybuffer',
        headers: { 
                    'Authorization': 'Bearer ' + req.session.xero_access_token,
                    'Xero-tenant-id': req.session.tenantId,
                    'Content-type': 'application/pdf',
                    'Accept': 'application/pdf'}
    }

        const inv = await axios.get(`https://api.xero.com/api.xro/2.0/Invoices/${req.params.invoiceid}`, config_xero)
        
        console.log(inv.data)
        
        res.header('Content-Disposition', `attachment; filename=${req.params.invoiceid}.pdf`)
        res.header('Content-Type', 'application/pdf')
        res.send(inv.data)

        
        
    
})

//Try to get PDF invoices returned in react
router.get('/pdf/react/:invoiceid', async (req, res) => {
    
    //Having all kinds of issues fixed eventually with responseType = array buffer. Removing array buffer returns the scrambled pdf raw code to the browser / console
    const config_xero = {
//        encoding: null,
//        responseType: 'stream',
//        responseType: 'arraybuffer',
        headers: { 
                    'Authorization': 'Bearer ' + req.session.xero_access_token,
                    'Xero-tenant-id': req.session.tenantId,
                    'Content-type': 'application/pdf',
                    'Accept': 'application/pdf'}
    }

        const inv = await axios.get(`https://api.xero.com/api.xro/2.0/Invoices/${req.params.invoiceid}`, config_xero)
        
        console.log(inv.data)
    
        
        res.header('Content-Disposition', 'attachment; filename=test.pdf')
        res.header('Content-Type', 'application/pdf')
        res.send(inv.data)

        
        
    
})

//Get invoices for a contact

router.get('/contactinvoices/:id', async (req, res) => {
    const config_xero = {
        headers: { 
                    'Authorization': 'Bearer ' + req.session.xero_access_token,
                    'Xero-tenant-id': req.session.tenantId}
    }
    
    console.log('Params ' + req.params.id)
    
    console.log('Xero config ' + config_xero)
    
    const invoices = await axios.get(`https://api.xero.com/api.xro/2.0/Invoices?ContactIDs=${req.params.id}`, config_xero)
    
    res.send(invoices.data.Invoices)
    
    
})

module.exports = router
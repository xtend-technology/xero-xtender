const express = require('express')
const router = express.Router()
const session = require('express-session');
const axios = require('axios')

router.get('/', (req, res) => {
    const time_now = new Date().getTime()
    const time_to_expiry =  req.session.xero_access_token_expiry - time_now
    res.status(200).json(time_to_expiry)
    
})

router.get('/tenants', async (req, res) => {
    
    const token =  req.session.xero_access_token
    
    const config_xero = {

        headers: { 
                    'Authorization': 'Bearer ' + req.session.xero_access_token,
                    'Xero-tenant-id': req.session.tenantId,
                    'Content-type': 'application/json',
                    }
    }
    
    
    
    const request = await axios.get('https://api.xero.com/connections', config_xero)

    
    
    res.status(200).json(request.data)
    
})

module.exports = router
import React from 'react';
import XeroLogin from './XeroLogin';
import Customers from './Customers';
import Customer from './Customer';
import About from './About';
import BankTransactions from './BankTransactions';
import { Route, Link } from "react-router-dom";
import './Greeting.css'



const Greeting = props => {
    
    const client_id_xero = process.env.REACT_APP_CLIENT_ID_XERO
const scopes_xero = process.env.REACT_APP_SCOPES_XERO

const redirectUri_xero = process.env.NODE_ENV === 'production' ? 'https://xero-xtender.herokuapp.com/callback' : process.env.REACT_APP_DEV_REDIRECT_URL_XERO;
    
    

//     let message = (props.appuser)
//      ? `Hi, ${props.appuser.email}!`
//      : "You're not logged in. ";
    
    let message = (props.xeroStatus)
      ? `Hi, Thanks for logging in! There's no logout function yet so you'll need to login again after 30 mins`
      : "You're not logged in. ";
    
    
    
    if(props.xeroStatus === true) {
        return(
        <div className='Greeting'>
        <header>
            <nav>
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/customers'>Customers</Link></li>
                    <li><Link to='/bank-transactions'>Bank Transactions</Link></li>
                    <li><Link to='/about'>About</Link></li>
                </ul>
            </nav>
        </header>
        <br />
        <br />
        {message}
        
        
         
                {/*<Customers />*/}
        <Route path='/customers' exact component={Customers} />
            <Route path= '/customers/:customerId' component={Customer} />
        <Route path='/bank-transactions' exact component={BankTransactions} />
        <Route path='/about' exact component={About} />
        </div>
    )
    } else if (props.appuser){
        return(
        <div className='Greeting'>
        <header>
            <nav>
                <ul>
                    <li><Link to='/'>Home</Link></li>
                </ul>
            </nav>
        </header>
        
        {message}
        
        <XeroLogin uri={`https://login.xero.com/identity/connect/authorize?client_id=${client_id_xero}&scope=${scopes_xero}&response_type=code&redirect_uri=${redirectUri_xero}`} />
         
                {/*<Customers />*/}
        
        </div>
    )
        
     } else {
        return(
            <div className='Greeting'>
            <header>
            <nav>
                <ul>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/about'>About</Link></li>
                
                </ul>
            </nav>
        </header>
        <div>
        {message} 
        
        <XeroLogin uri={`https://login.xero.com/identity/connect/authorize?client_id=${client_id_xero}&scope=${scopes_xero}&response_type=code&redirect_uri=${redirectUri_xero}`} />
        </div>
        <Route path='/about' exact component={About} />
        </div>
    ) 
     } 
    
    
     
     
    
    
}

export default Greeting
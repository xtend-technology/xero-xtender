import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Route,
  useParams,
        useRouteMatch
} from "react-router-dom";
import CustomerInvoices from './CustomerInvoices'
import { Icon} from 'semantic-ui-react'

const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_DEV_API_URL;

const Customer = (props) => {
               const [customer, setCustomer] = useState([])
               const [customerInvoices, setCustomerInvoices] = useState({invoices: [],
                                                        hidden: true})
               
               let { customerId } = useParams();
           
           

           useEffect(() => {
    async function getCustomer(){
        try{
           const result = await axios.get(`${apiUrl}/customers/${customerId}`, {withCredentials: true})
           
    
    setCustomer(result.data.Contacts) 
            
            
        } catch(err) {
            console.log(err)
        }
       
    }
        getCustomer()
               
               
        
//        However, when you run your application, you should stumble into a nasty loop. The effect hook runs when the component mounts but also when the component updates. Because we are setting the state after every data fetch, the component updates and the effect runs again. It fetches the data again and again. That's a bug and needs to be avoided. We only want to fetch data when the component mounts. That's why you can provide an empty array as second argument to the effect hook to avoid activating it on component updates but only for the mounting of the component.
  }, []);

  //Get all invoices

  const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_DEV_API_URL;

  const handleClick = async (e, booger) => {
    e.preventDefault();
console.log('The link was clicked.');
   console.log(booger)
   
   
   const result = await axios.get(`${apiUrl}/invoices/contactinvoices/${booger.ContactID}`,   {withCredentials: true})
   
   console.log(result.data)
   
       const config = {
//        encoding: null,
//        responseType: 'stream',
    responseType: 'arraybuffer',
           withCredentials: true
}
   
   result.data.forEach((invoice) => {
       const invNum = invoice.InvoiceNumber
       axios.get(`${apiUrl}/invoices/pdf/${invoice.InvoiceID}`, config)
       .then(result => {
           console.log(result)
//               const array = new Uint8Array(result.data)
//               const blob = new Blob([array], {type: 'application/pdf'})
//          const url = window.URL.createObjectURL(blob)
//               window.open(url, '_blank');
           
           const url = window.URL.createObjectURL(new Blob([result.data]
      ,{type: "application/pdf"}))
    var link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${invNum}.pdf`);
    document.body.appendChild(link);
    link.click();
           
       }).catch(err => 
               console.log(err))
   })
   
   console.log(result)
}
    

let { path, url } = useRouteMatch(); 
    
  
    
    const seeInvoices = () => {
        
        setCustomerInvoices({hidden: !customerInvoices.hidden})
    }
    
        
    return (
        
        
        <div>
            {customer.map((booger, i) => 
                          
          
                 
                     <div key={i}>
        <h3>Customer detail</h3>
        <h3>Name: {booger.Name}</h3>
        <h3>Email: {booger.EmailAddress}</h3>
        <h3>First Name: {booger.FirstName}</h3>
        <h3>Last Name: {booger.LastName}</h3>
        <h3>Balance owing: $ {!booger.Balances? '-' : booger.Balances.AccountsReceivable.Outstanding}</h3>
        {/*<Link to ={`${url}/invoices`}>See invoices</Link>
                               <Route path={`${path}/invoices`} exact component={CustomerInvoices} />*/}
        
                              <p onClick={seeInvoices} style={{cursor: 'pointer'}}>{customerInvoices.hidden? 'See invoices' : 'Hide invoices'}</p>
                              <div>{customerInvoices.hidden ? null : <CustomerInvoices id ={customerId}/>}</div>
                              <br />
                              <div onClick={(e) => {handleClick(e, booger)}} style={{cursor: 'pointer'}}>
                              <Icon name='file pdf outline' link onClick={(e) => {handleClick(e, booger)}} /> <p>Download all invoices ever generated for this customer.</p>
                              </div>
                              
                                
                 </div>

    
    
                
                
                 
                 
                )  }
        </div>
        
    )
    
   
                             
    
            
} 

export default Customer;
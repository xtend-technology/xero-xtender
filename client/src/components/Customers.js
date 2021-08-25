import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, Icon, Pagination } from 'semantic-ui-react'
import { Route, Link, useRouteMatch } from 'react-router-dom'
import Customer from './Customer'



const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_DEV_API_URL;


const Customers = props => {
           const [customers, setCustomers] = useState([])
           const [length, setLength] = useState(0)
           const [activePage, setActivePage] = useState(1);
        
           
    
               useEffect(() => {
    async function getLength(){
        try{
           const result = await axios.get(`${apiUrl}/customers`, {withCredentials: true})
           console.log(result)
            
            const contactLength = Math.ceil(result.data.Contacts.length/100)
            console.log('length ' + contactLength)
    
    setLength(contactLength)
            console.log(result.data)
            
        } catch(err) {
            console.log(err)
        }
       
    }
        getLength()
               
               
        
//        However, when you run your application, you should stumble into a nasty loop. The effect hook runs when the component mounts but also when the component updates. Because we are setting the state after every data fetch, the component updates and the effect runs again. It fetches the data again and again. That's a bug and needs to be avoided. We only want to fetch data when the component mounts. That's why you can provide an empty array as second argument to the effect hook to avoid activating it on component updates but only for the mounting of the component.
  }, []);
    
    useEffect(() => {
    async function getContactPage(){
        try{
           const result = await axios.get(`${apiUrl}/customers/length/${activePage}`, {withCredentials: true})
           console.log(result)
            
    
    setCustomers(result.data.Contacts)
            
        } catch(err) {
            console.log(err)
        }
       
    }
        getContactPage()
               
               
        
//        However, when you run your application, you should stumble into a nasty loop. The effect hook runs when the component mounts but also when the component updates. Because we are setting the state after every data fetch, the component updates and the effect runs again. It fetches the data again and again. That's a bug and needs to be avoided. We only want to fetch data when the component mounts. That's why you can provide an empty array as second argument to the effect hook to avoid activating it on component updates but only for the mounting of the component.
  }, [activePage]);

    
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
  
  const onChange = (e, pageInfo) => {
      setActivePage(pageInfo.activePage);
  }
  
  let { path, url } = useRouteMatch();
    
    return (
    <div>
        <br />
        <br />
       <h3>Customers</h3>
       <br />
       <p>! Means name fields are incomplete</p>
       <p>* Means email is incomplete</p>

        <List>
        {customers.map((booger, i) => 
//          <li key={i}>{booger.Name} <a href="#" onClick={(e) => {handleClick(e, booger)}}>List invoices</a></li>
//         
     
    <List.Item key={i}>
           
          
        
        <List.Content as={ Link } to={`${url}/${booger.ContactID}`}>{booger.Name} {!booger.FirstName && !booger.LastName && !booger.EmailAddress
? '!*' : booger.FirstName && booger.LastName && booger.EmailAddress? '': booger.EmailAddress? '!' :booger.FirstName || booger.LastName? '*':''}</List.Content>
        
        </List.Item>
        
      )   
        }

</List>

{customers.length > 0 ? <Pagination
    boundaryRange={0}
    onPageChange={onChange}
    defaultActivePage={1}
    ellipsisItem={null}
    firstItem={null}
    lastItem={null}
    siblingRange={1}
    totalPages={length}
  /> : 'Loading..'}


      </div>
  );
 
}

export default Customers
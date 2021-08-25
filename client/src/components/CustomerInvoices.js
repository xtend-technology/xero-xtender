import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, Icon } from 'semantic-ui-react'


const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_DEV_API_URL;

const CustomerInvoices = (props) => {
    const [invoices, setInvoices] = useState([])

           useEffect(() => {
    async function getInvoices(){
        try{
           const result = await axios.get(`${apiUrl}/invoices/contactinvoices/${props.id}`, {withCredentials: true})
           
    
    setInvoices(result.data) 
           
            
        } catch(err) {
            console.log(err)
        }
       
    }
        getInvoices()
               
               
        
//        However, when you run your application, you should stumble into a nasty loop. The effect hook runs when the component mounts but also when the component updates. Because we are setting the state after every data fetch, the component updates and the effect runs again. It fetches the data again and again. That's a bug and needs to be avoided. We only want to fetch data when the component mounts. That's why you can provide an empty array as second argument to the effect hook to avoid activating it on component updates but only for the mounting of the component.
  }, []);
    
    const handleClick = async (e, booger) => {
        e.preventDefault();
    console.log('The link was clicked.');
       console.log(booger)
       
       
       
       
       
       
           const config = {
//        encoding: null,
//        responseType: 'stream',
        responseType: 'arraybuffer',
               withCredentials: true
    }
       
       
           
           const result = await axios.get(`${apiUrl}/invoices/pdf/${booger.InvoiceID}`, config)
           
          try {
              console.log(result.data)

               
               const url = window.URL.createObjectURL(new Blob([result.data]
          ,{type: "application/pdf"}))
        var link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${booger.InvoiceNumber}.pdf`);
        document.body.appendChild(link);
        link.click();
               
           
       
       
       console.log(result)
          } catch (err){
              console.log(err)
    } 
           
    }
    
        
    return (
        <div>
        <List>
            {invoices.map((booger, i) => 
            
        <List.Item key={i}>
           
          
        <List.Content>Inv {booger.InvoiceNumber} Status {booger.Status}</List.Content>
        <Icon name='file pdf outline' link onClick={(e) => {handleClick(e, booger)}} />
        </List.Item>
                          )
        }
        
        

</List>
        
        
        
            
        </div>
        
    )                                  
} 

export default CustomerInvoices;
import React, { useState, useEffect } from 'react';
import Greeting from './components/Greeting';
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css'
import { Container } from 'semantic-ui-react'
import Header from './components/styling/Header'
import Footer from './components/styling/Footer'




//const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_DEV_API_URL;


const apiUrl = process.env.NODE_ENV === 'production' ? 'https://xero-xtender.herokuapp.com' : 'http://localhost:3000';

console.log(apiUrl)


function App() {
    const [user, setUser] = useState()
    const [xeroLoggedIn, setXeroLoggedIn] = useState(false)
    
    
    

    
        useEffect(() => {
    async function getXeroLoginStatus(){
        
        
        
        try{
           const result = await axios.get(`${apiUrl}/xero_token`, {withCredentials: true})
           console.log(apiUrl)
            
            if (result.data > 0) {
                setXeroLoggedIn(true) 
            }
    
            
        } catch(err) {
            console.log(err)
        }
       
    }
            
        getXeroLoginStatus()
            
        

  }, []);
    
    


  return (
  
  
    <div>
      <Container>
      <Header />
      <Greeting xeroStatus={xeroLoggedIn}/>
      <Footer />
      </Container>
      </div>

  );
}

export default App;

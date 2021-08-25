import React, { useState } from 'react';
import axios from 'axios';
import Success from './Success'

const BankTransactions = props => {
const [selectedFile, setSelectedFile] = useState(null)
const [successfulUpload, setSuccessfulUpload] = useState('none')

const apiUrl = process.env.NODE_ENV === 'production' ? 'https://xero-xtender.herokuapp.com' : process.env.REACT_APP_DEV_API_URL

const onFileChange = (e) => { 
     
      // Update the state 
      setSelectedFile(e.target.files[0] ); 
     
    };
    
    // On file upload (click the upload button) 
    const onFileUpload = () => { 
     
      // Create an object of formData 
      const formData = new FormData(); 
     
      // Update the formData object 
      formData.append( 
        "myFile", 
        selectedFile, 
        selectedFile.name 
      ); 
     
      // Details of the uploaded file 
      console.log(selectedFile); 
     
      // Request made to the backend api 
      // Send formData object 
      axios.post(`${apiUrl}/bank_transactions`, formData, {withCredentials: true})
          .then(response => {console.log(response)
                             if(response.status === 200) {
                                 setSuccessfulUpload('success')
                             }
                            
                            })
          .catch(err => {console.log(err)
                        setSuccessfulUpload('fail')
                        }); 
    };
    
    // File content to be displayed after 
    // file upload is complete 
    const fileData = () => { 
     
      if (selectedFile) { 
          
        return ( 
          <div> 
            <h2>File Details:</h2> 
            <p>File Name: {selectedFile.name}</p> 
            <p>File Type: {selectedFile.type}</p> 
            <p> 
              Last Modified:{" "} 
            {selectedFile.lastModifiedDate.toDateString()} 
            </p> 
          </div> 
        ); 
      } else { 
        return ( 
          <div> 
            <br /> 
            <h4>Choose before Pressing the Upload button</h4> 
          </div> 
        ); 
      } 
    }; 

    return (
      
        <div> 
            <h1> 
              Upload csv 
            </h1> 
    
            <div> 
                <input type="file" onChange={onFileChange} /> 
                <button onClick={onFileUpload}> 
                  Upload 
                </button> 
                <br />
            <a href="https://drive.google.com/file/d/12Slmp1Fc8wuCIy5A8F8LdvM6KInSpumB/view?usp=sharing" target="_blank">Download Template file</a>
            </div> 
          {fileData()} 
    <Success status={successfulUpload} />
        </div>
    )
  }

export default BankTransactions

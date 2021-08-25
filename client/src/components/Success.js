import React from 'react';

const Success = props => {
    if(props.status === 'none') {
        return null
    } else if (props.status === 'success') {
        
        
        return (
      
        <div>
            <p>csv successfully uploaded. Check bank transactions in Xero. Refresh page to add another</p>
      </div>
    )
    } 
    
    return (
      
        <div>
            <p>csv upload failed. Refresh page to try again. Otherwise contact support</p>
      </div>
    )
    
  }

export default Success
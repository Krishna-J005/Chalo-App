import React from 'react'
import img from './img.jpg'
function NotFound() {
  return (
    <>
    <div style={{textAlign : 'center', fontSize : '20px' ,fontWeight : 'bold' ,marginBottom : '5px'}}>Not Found</div>
    <img style ={{height : '500px' ,width : '500px'}} src ={img} alt = "Not Found"/>
    </>
    
  )
}

export default NotFound
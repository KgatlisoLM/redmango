import React from 'react'

function MainLoader({type = "warning", widthSize = 4, heightSize = 4 }) {
  return (
    <>
      <div 
       style={{
         position: "fixed",
         top: "0",
         left: "0",
         width: "100vw",
         height: "100vh",
         display: "flex",
         alignItems: "center",
         justifyContent: "center",
       }}>
        <div 
            className={`spinner-border text-${type}`} 
            style={{width: `${widthSize}rem`, height: `${heightSize}rem`}}>
        </div>
      </div>
    </>
  )
}

export default MainLoader;
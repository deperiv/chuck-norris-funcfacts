import React from 'react';

const Navigation = ({onRouteChange, route}) => {
    return (
        (route === 'register')
        ? (
            <nav style={{display: 'flex', justifyContent: 'flex-end', paddingTop:'20px'}}>
                <p onClick={()=> onRouteChange('home')} className='link-p'>Go back to home</p>
                <p onClick={()=> onRouteChange('signin')} className='link-p'>Sign In</p>
            </nav> 
        )
        : (
            route === 'signin' 
            ? (
            <nav style={{display: 'flex', justifyContent: 'flex-end', paddingTop:'20px'}}>
                <p onClick={()=> onRouteChange('register')} className='link-p'>Register</p>
                <p onClick={()=> onRouteChange('home')} className='link-p'>Go back to home</p>
            </nav> 
            )
            : (
                <nav style={{display: 'flex', justifyContent: 'flex-end', paddingTop:'20px'}}>
                    <p onClick={()=> onRouteChange('register')} className='link-p'>Register</p>
                    <p onClick={()=> onRouteChange('signin')} className='link-p'>Sign In</p>
                </nav> 
            )
        )
    )
}

export default Navigation
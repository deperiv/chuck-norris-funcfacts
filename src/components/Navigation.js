import React from 'react';

const Navigation = ({onRouteChange, route}) => {
    return (
        (route === 'register')
        ? (
            <nav className='navigation'>
                <p onClick={()=> onRouteChange('home')} className='link-p'>Home</p>
                <p onClick={()=> onRouteChange('signin')} className='link-p'>Sign In</p>
            </nav> 
        )
        : (
            route === 'signin' 
            ? (
            <nav className='navigation'>
                <p onClick={()=> onRouteChange('register')} className='link-p'>Register</p>
                <p onClick={()=> onRouteChange('home')} className='link-p'>Home</p>
            </nav> 
            )
            : (
                route === 'profile'
                ? (
                    <nav className='navigation'>
                        <p onClick={()=> onRouteChange('home')} className='link-p'>Sign out</p>
                    </nav> 
                ) 
                : ( //Home
                    <nav className='navigation'>
                        <p onClick={()=> onRouteChange('register')} className='link-p'>Register</p> 
                        <p onClick={()=> onRouteChange('signin')} className='link-p'>Sign In</p>
                    </nav> 
                )
                
            )
        )
    )
}

export default Navigation
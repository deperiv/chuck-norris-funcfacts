import React from 'react';

const Fact = ({text}) => {
    return (
        <div className='fact-dec animate__animated animate__fadeInLeft'>
            <p>{text}</p>
        </div>
    );
}

export default Fact
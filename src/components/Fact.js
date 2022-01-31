import React from 'react';

const Fact = ({id, text}) => {
    return (
        <div className='fact-dec'>
            <p>{text}</p>
        </div>
    );
}

export default Fact
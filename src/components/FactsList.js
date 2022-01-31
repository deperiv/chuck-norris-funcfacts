import React from 'react';
import Fact from './Fact';

const FactList = ({facts}) => {
    return (
        <div>
            {
                facts.map((funfact) => {
                    return (
                    <Fact 
                        key={funfact.id}
                        text={funfact.value}
                    />
                    );
                })
            }
        </div>
    )
}
export default FactList;
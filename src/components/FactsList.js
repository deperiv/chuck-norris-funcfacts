import React from 'react';
import Fact from './Fact';

const FactList = ({facts, displayedAll}) => {
    return (
        <div >
            {
                displayedAll?
                    <>  
                        <p>There are no more facts for this category. ¡Pick another one!</p>
                        {facts.map((funfact) => {
                            return (
                                <Fact 
                                    key={funfact.id}
                                    text={funfact.value}
                                />
                            );
                        })}
                    </>
                :
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
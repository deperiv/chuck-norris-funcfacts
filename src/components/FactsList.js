import React from 'react';
import Fact from './Fact';

const FactList = ({facts, displayedAll, addFavoriteFact, removeFavoriteFact, route, alreadyFavorite}) => {
    return (
        <div>
            {
                displayedAll?
                        <p>There are no more facts for this category. ¡Pick another one!</p>
                :
                    <></>
            }    
            {
                facts.map((funfact) => {
                    return (
                        <Fact 
                            key={funfact.id}
                            id={funfact.id}
                            text={funfact.value}
                            addFavoriteFact={addFavoriteFact} 
                            removeFavoriteFact={removeFavoriteFact}
                            alreadyFavorite={alreadyFavorite}
                            route={route}
                        />
                    );
                })
            }
        </div>
    )
}
export default FactList;
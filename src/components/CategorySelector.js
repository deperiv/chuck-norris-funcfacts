import React from 'react';
import Category from '../components/Category';

const CategorySelector = ({categories, selectedCategory, changeCategory}) => {
    return (
        <div className="dropdown">
            <div className="dropbtn">
                <p className='cap'>Category: {selectedCategory}</p> 
                <div className='arrow down'></div>
            </div>

            <div className="dropdown-content scrollWrapper">
            {
                categories.map((category, index) => {
                    return (
                        <Category 
                            key={index} 
                            category={category} 
                            changeCategory={changeCategory}
                        />
                    )
                })
            }
            </div>
        </div>  
    )
}

export default CategorySelector
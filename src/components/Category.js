import React from 'react';

const CategorySelector = ({changeCategory, category}) => {
    return (
        <button className = "cat-button" onClick={() => changeCategory(category)}>{category}</button>
    )
}

export default CategorySelector
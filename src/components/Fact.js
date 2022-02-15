import React from 'react';
import star  from '../img/star.png';


class Fact extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isFavorite: false
        }
    }

    toggleFavorite = (id, text) => {
        console.log('Toggle')
        if (this.state.isFavorite){
            this.setState({isFavorite: false});
            this.props.removeFavoriteFact({id: id, value: text});
        } else {
            this.setState({isFavorite: true});
            this.props.addFavoriteFact({id: id, value: text});            
        }
    }

    render(){
        const {isFavorite} = this.state;
        const {text, id, route, alreadyFavorite} = this.props;
        return (
            route === 'profile'
            ?(
                <div className='fact-dec animate__animated animate__fadeInLeft'>
                    {
                        alreadyFavorite 
                        ? (
                            <img onClick={()=> this.toggleFavorite(id, text)} className="star star-selected" src={star} alt="Star"/>
                        )
                        : (
                            isFavorite 
                            ? (
                                <img onClick={()=> this.toggleFavorite(id, text)} className="star star-selected" src={star} alt="Star"/>
                            )
                            : (
                                <img onClick={()=> this.toggleFavorite(id, text)} className="star" src={star} alt="Star"/>
                            )
                        )
                    }
                    
                    
                    <p style={{paddingLeft: '20px'}}>{text}</p>
                </div>
            )
            :(
                <div className='fact-dec animate__animated animate__fadeInLeft'>
                    <p>{text}</p>
                </div>
            )
        );
    }
}

export default Fact
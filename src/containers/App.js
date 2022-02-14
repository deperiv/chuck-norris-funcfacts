import React, {Component} from 'react';
import './App.css';
import Navigation       from '../components/Navigation';
import CategorySelector from '../components/CategorySelector';
import Body             from '../components/Body';
import 'animate.css';
import SignIn from '../components/SignIn';
import Register from '../components/Register';

class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            categories: [],
            selectedCategory : 'All',
            route: 'profile',
            isSignedIn: false,
            user: {
                name: 'Bob',
                favoriteFacts: [
                    {
                        id: 1,
                        value: 'Chuck Norris once flicked Mickey Rourke on the nose.'
                    },
                    {
                        id: 4,
                        value: 'Cristiano Ronaldo is only good at soccer for one reason. Chuck Norris taught him how to roundhouse the ball.'
                    }
                ]
            }
        }

    };

    componentDidMount(){
        fetch('https://api.chucknorris.io/jokes/categories')  
        .then(resp => resp.json())
        .then(categories => this.setState({categories: ['All', ...categories]}))
        .catch(error => console.log(error));
    }

    changeCategory = (category) => {
        this.setState({selectedCategory: category})
    }

    showFavoriteFacts = () => {
        this.setState({facts: this.state.user.favoriteFacts})
    }

    onRouteChange = (route) => {
        if(route === 'signout') {
          this.setState({isSignedIn: false})
        } else if (route === 'home') {
          this.setState({isSignedIn: true})
        }
        this.setState({route: route})
    }

    render(){
        const {categories, selectedCategory, route} = this.state;

        return (
            <>  
                <Navigation onRouteChange={this.onRouteChange} route={route}/>
                <h1 style={{fontSize: '4em', margin: '10px'}}>Chuck Norris Fun Facts</h1>
                {
                    route === 'home'
                    ? <>
                        <div className='mid-row'>
                            <div className="warning-msg"><p>¡Beware! Some fun facts may be politically incorrect for certain audiences</p></div>
                            <CategorySelector categories={categories} selectedCategory={selectedCategory} changeCategory={this.changeCategory}/> 
                        </div>
                        <Body 
                            selectedCategory={selectedCategory}
                        />
                    </>
                    : (
                        (route === 'profile')
                        ? <> 
                        <div className='mid-row'>
                            <div className="warning-msg"><p>Welcome {this.state.user.name}! You better be ready to have some fun</p><p>¡Beware! Some fun facts may be politically incorrect for certain audiences</p></div>
                            <CategorySelector categories={categories} selectedCategory={selectedCategory} changeCategory={this.changeCategory}/> 
                            <div className='favorite-btnn' onClick={() => this.showFavoriteFacts()}><p>Show your favorite facts</p></div>
                        </div>
                        <Body 
                            selectedCategory={selectedCategory}
                        />                     
                        </>
                        : (
                            (route === 'signin')
                            ? <SignIn onRouteChange={this.onRouteChange}/>
                            : <Register onRouteChange={this.onRouteChange}/>
                        )
                    )
                }
                
                <footer>
                    <p>By deperazar. Using the <i className='link-p'>Chuck Norris API</i></p>
                </footer>  
                
            </>
            
        );
    }        
}

export default App;
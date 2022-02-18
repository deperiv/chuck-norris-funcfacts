import React, {Component} from 'react';
import './App.css';
import Navigation       from '../components/Navigation';
import Body             from '../components/Body';
import 'animate.css';
import SignIn from '../components/SignIn';
import Register from '../components/Register';

class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            route: 'profile',
            isSignedIn: false,
            user: {
                id: '1',
                name: 'John'
            }
        }
    };

    addFavoriteFact = (fact) => {
        console.log(fact)
        fetch('http://localhost:3001/addFavorite', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                factid: fact.id,
                text: fact.value,
                userid: this.state.user.id 
            })
        })
        // .then(resp => resp.json())
        // .then(facts => {
        //     console.log(facts)
        //     this.setState({user:Object.assign(this.state.user, {favoriteFacts: facts})})
        // })
    }

    removeFavoriteFact = (fact) => {
        fetch('http://localhost:3001/removeFavorite', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                factid: fact.id,
                userid: this.state.user.id 
            })
        })
        // .then(facts => {
        //     this.setState({user:Object.assign(this.state.user, {favoriteFacts: facts})})
        // })
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
        const {route} = this.state;
        return (
            <>  
                <Navigation onRouteChange={this.onRouteChange} route={route}/>
                <p className='title'>Chuck Norris Fun Facts</p>
                {
                    route === 'home'
                    ? <>
                        <div className='mid-row'>
                            <div className="warning-msg"><p>¡Beware! Some fun facts may be politically incorrect for certain audiences</p></div>
                        </div>
                        <Body 
                            addFavoriteFact={this.addFavoriteFact} //Wont be used
                            removeFavoriteFact={this.removeFavoriteFact} //Wont be used
                            route={route}
                        />
                    </>
                    : (
                        (route === 'profile')
                        ? <> 
                        <div className='mid-row'>
                            <div className="warning-msg"><p>Welcome {this.state.user.name}! You better be ready to have some fun</p><p>¡Beware! Some fun facts may be politically incorrect for certain audiences</p></div>
                        </div>
                        <Body 
                            userID = {this.state.user.id}
                            addFavoriteFact={this.addFavoriteFact} 
                            removeFavoriteFact={this.removeFavoriteFact}
                            route={route}
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
import React, {Component} from 'react';
import Navigation         from '../components/Navigation';
import Body               from '../components/Body';
import SignIn             from '../components/SignIn';
import Register           from '../components/Register';
import './App.css';
import 'animate.css';

class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            route: 'home',
            isSignedIn: false,
            user: {
                id: '',
                name: '',
                email: '',
                joined: ''
            }
        }
    };

    loadUser = (data) => {
        this.setState({
          user: {
            id: data.id,
            name: data.name,
            email: data.email,
            joined: data.joined
          }
        })
      }

    addFavoriteFact = (fact) => {
        fetch('https://shrouded-sea-80504.herokuapp.com/addFavorite', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                factid: fact.id,
                text: fact.value,
                userid: this.state.user.id 
            })
        })
    }

    removeFavoriteFact = (fact) => {
        fetch('https://shrouded-sea-80504.herokuapp.com/removeFavorite', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                factid: fact.id,
                userid: this.state.user.id 
            })
        })
    }

    onRouteChange = (route) => {
        if (route === 'home') {
          this.setState({isSignedIn: false})
        } else if (route === 'profile') {
            this.setState({isSignedIn: true})
          }
        this.setState({route: route})
    }

    render(){
        const {route} = this.state;
        return (
            <>  
                <Navigation onRouteChange={this.onRouteChange} route={route}/>
                <p className='title'>Chuck Norris Jokes</p>
                {
                    route === 'home'
                    ? <>
                        <div className='mid-row'>
                            <div className="warning-msg"><p>¡Beware! Some jokes may be politically incorrect for certain audiences</p></div>
                        </div>
                        <Body 
                            addFavoriteFact={this.addFavoriteFact} //Wont be used
                            removeFavoriteFact={this.removeFavoriteFact} //Wont be used
                            route={route}
                            noBody={false}
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
                            noBody={false}
                        />                   
                        </>
                        : (
                            (route === 'signin')
                            ? <>
                                <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
                                <Body noBody={true}/>
                            </>
                            : <>
                                <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
                                <Body noBody={true}/>
                            </>
                        )
                    )
                }
                <footer>
                    <p>By <a 
                            href='mailto: danielpblog2014@gmail.com' 
                            rel="noreferrer" 
                            target='_blank' 
                            className='link-p'>deperazar </a>
                        </p>
                        . Using the     
                        <a 
                            href='https://api.chucknorris.io' 
                            rel="noreferrer" 
                            target='_blank' 
                            className='link-p'>Chuck Norris API</a>
                        </p>
                </footer>  
                
            </>
            
        );
    }        
}

export default App;
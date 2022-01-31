import React, {Component} from 'react';
import './App.css';
import ErrorBoundary from '../components/ErrorBoundary';
import FactsList from '../components/FactsList';
import Scroll from '../components/Scroll';
import chuck from '../img/chuck.png';
import 'animate.css';


class App extends Component {
    constructor(){
        super();
        this.state = {
            facts: [],
            category : ''
        }

    };

    addFact =  () => {
        fetch('https://api.chucknorris.io/jokes/random') 
        .then(resp => resp.json())
        .then(newFact => this.setState({facts: [newFact, ...this.state.facts]}))
        
        const a = document.getElementById("FC")
        console.log(this.state.facts)
    }

    render(){
        const {facts} = this.state;
        return (
            <> 
                <h1>Chuck Norris Fun Facts</h1>
                <div className='body-structure'>
                    <div id="FC" className='body-doc'>
                        <img className="image animate__animated animate__jackInTheBox" src={chuck} alt="Chuck"/>
                        <button className='button cool-bttn' onClick={this.addFact}>Get a Random FunFact</button>
                    </div>
 
                        <Scroll>
                            {!facts.length ? <h2>No fun facts yet</h2> : (
                            <ErrorBoundary>
                                <FactsList facts={facts}/>
                            </ErrorBoundary>
                            )}
                        </Scroll>       
                </div>
                
            </>
            
        );
    }        
}

export default App;
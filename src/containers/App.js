import React, {Component} from 'react';
import './App.css';
import Navigation       from '../components/Navigation';
import CategorySelector from '../components/CategorySelector';
import Scroll           from '../components/Scroll';
import ErrorBoundary    from '../components/ErrorBoundary';
import FactsList        from '../components/FactsList';
import chuck            from '../img/chuck.png';
import 'animate.css';
import SignIn from '../components/SignIn';
import Register from '../components/Register';

class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            facts: [],
            categories: [],
            selectedCategory : 'All',
            finishedPlaying: false,
            repeatedCount: 0,
            displayedAll: false,
            route: 'home',
            isSignedIn: false
        }

    };

    componentDidMount(){
        fetch('https://api.chucknorris.io/jokes/categories')  
        .then(resp => resp.json())
        .then(categories => this.setState({categories: ['All', ...categories]}))
        .catch(error => console.log(error));
    }

    checkRepetition = (factToCheck) => {
        const ids = this.state.facts.filter(fact => fact.id === factToCheck.id)
        return ids.length? true:false
    };

    appendIfNotRepeated = (category, newFact) => {
        if (this.checkRepetition(newFact)){//If the fact is already in the facts array
            this.setState({repeatedCount: this.state.repeatedCount+1})
            if (this.state.repeatedCount < 10){
                this.addFact(category)
            } else {
                this.setState({displayedAll: true})
                console.log('No more')
            }
            
        } else {
            this.setState({displayedAll: false, repeatedCount: 0})
            this.setState({facts: [newFact, ...this.state.facts]})
        }        
    }

    playFact = (text, onEndFunction = ()=>{}) => {

        const options = {
            key: 'ddb7eaed19ad4c66a911c6e73ccb9a19',
            language: 'en-us',
            voice: 'Amy',
            audioFormat: '16khz_16bit_mono',
            src: encodeURIComponent(text)
        }
        
        fetch(`http://api.voicerss.org/?key=${options.key}&hl=${options.language}&v=${options.voice}&c=MP3&f=${options.audioFormat}&src=${options.src}`, {            
        method: "GET"
        })
        .then(response => {
            const audio = new Audio(response.url);
            audio.play()
            audio.addEventListener("ended", onEndFunction);
        })
        .catch(err => console.error(err));     
    }

    async addFact (category) {
        if (category === 'All'){
            const responseFetch = await fetch('https://api.chucknorris.io/jokes/random');
            const responseJson = await responseFetch.json();
            this.appendIfNotRepeated(category, responseJson)
            return responseJson;
        } else {
            const responseFetch = await fetch(`https://api.chucknorris.io/jokes/random?category=${category}`);
            const responseJson = await responseFetch.json();
            this.appendIfNotRepeated(category, responseJson)
            return responseJson;
        }
    }

    goAuto = (command = 'keepGoing') => {
        const {selectedCategory, finishedPlaying} = this.state;
        if (command === 'start'){
            this.setState({finishedPlaying: false})
            this.addFact(selectedCategory)
            .then(fact => this.playFact(fact.value, this.goAuto))
            .catch(err => console.error(err));  
        } else {
            if (!finishedPlaying) { //If the stop button hasnt been pressed
                this.addFact(selectedCategory)
                .then(fact => this.playFact(fact.value, this.goAuto))
                .catch(err => console.error(err));  
            }
        }
    }
    
    stop = () => {
        this.setState({finishedPlaying: true})
    }

    changeCategory = (category) => {
        this.setState({selectedCategory: category})
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
        const {categories, selectedCategory, facts, displayedAll, route} = this.state;

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
                        
                        <div className='body-structure'>
                            <div className='body-doc'>
                                <img className="image animate__animated animate__jackInTheBox" src={chuck} alt="Chuck"/>
                                <div style={{width: '50%'}}>
                                    <button className='main-bttn cool-bttn' onClick={() => this.addFact(selectedCategory)}>Get a Random FunFact</button>
                                    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
                                        <button className='cool-bttn' onClick={()=>this.goAuto('start')}> Automatic </button>
                                        <button className='cool-bttn' onClick={()=>this.stop()}> Stop </button>
                                    </div>
                                </div>
                            </div>
                                <Scroll>
                                    {!facts.length ? 
                                        <h2>No fun facts yet</h2> 
                                    : (
                                        <ErrorBoundary>
                                                    <FactsList facts={facts} displayedAll={displayedAll}/>
                                        </ErrorBoundary>
                                    )}
                                </Scroll>
                        </div>
                    </>
                    : (
                        (route === 'signin')
                        ? <SignIn onRouteChange={this.onRouteChange}/>
                        : <Register onRouteChange={this.onRouteChange}/>
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
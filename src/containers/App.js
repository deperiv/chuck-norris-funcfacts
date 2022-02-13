import React, {Component} from 'react';
import './App.css';
import ErrorBoundary from '../components/ErrorBoundary';
import FactsList from '../components/FactsList';
import CategorySelector from '../components/CategorySelector';
import Scroll from '../components/Scroll';
import chuck from '../img/chuck.png';
import 'animate.css';


class App extends Component {
    constructor(){
        super();
        this.state = {
            facts: [],
            categories: [],
            selectedCategory : '',
            finishedPlaying: false,
            repeatedCount: 0,
            displayedAll: false
        }

    };

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
            voice: 'Mike',
            audioFormat: '16khz_16bit_mono',
            src: encodeURIComponent(text)
        }
        
        fetch(`http://api.voicerss.org/?key=${options.key}&hl=${options.language}&v=${options.voice}&c=MP3&f=${options.audioFormat}&src=${options.src}`, {
        "method": "GET"
        })
        .then(response => {
            const audio = new Audio(response.url);
            audio.play()
            audio.addEventListener("ended", onEndFunction);
        })
        .catch(err => console.error(err));     
    }

    async addFact (category) {
        if (!category.length){
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

    goAuto = () => {
        const {selectedCategory, finishedPlaying} = this.state;
        if (!finishedPlaying) {
            this.addFact(selectedCategory)
            .then(fact => this.playFact(fact.value, this.goAuto))
            .then(console.log)
        }
    }
    
    stop = () => {
        this.setState({finishedPlaying: true})
    }

    
    changeCategory = (category) => {
        category === 'All'?
            this.setState({selectedCategory: ''})
        :
            this.setState({selectedCategory: category})
    }

    componentDidMount(){
        fetch('https://api.chucknorris.io/jokes/categories')  
        .then(resp => resp.json())
        .then(categories => this.setState({categories: ["All", ...categories]}))
        .catch(error => console.log(error));
    }

    render(){
        const {categories, selectedCategory, facts, displayedAll} = this.state;

        return (
            <>  
                {/* <div className='get-in-container'>
                    <p className='get-in'>Wanna save your favorite facts? <br /> <a>Register here</a></p>
                    <p className='get-in'>Or if you already have an account <br /> <a>Sign In here</a></p>
                </div> */}
                <h1>Chuck Norris Fun Facts</h1>
                <div className='top-row'>
                    <div className="warning-msg"><p>¡Beware! Some fun facts may be politically incorrect for certain audiences</p></div>
                    <div className="dropdown">
                        <div className="dropbtn">
                           <p>Categories</p> 
                           <div className='arrow down'></div>
                        </div>
                
                        <div className="dropdown-content scrollWrapper">
                        {
                            categories.map((category, index) => {
                                return (<CategorySelector key={index} category={category} changeCategory={this.changeCategory}/>)
                            })
                        }
                        </div>
                    </div>
                    
                </div>
                
                <div className='body-structure'>
                    <div className='body-doc'>
                        <img className="image animate__animated animate__jackInTheBox" src={chuck} alt="Chuck"/>
                        <div style={{width: '50%'}}>
                            <button className='button cool-bttn' onClick={() => this.addFact(selectedCategory)}>Get a Random FunFact</button>
                            <div style={{display: 'flex', justifyContent: 'space-around', marginTop: '10px'}}>
                                <button className='button cool-bttn' onClick={()=>this.goAuto()}> Automatic </button>
                                <button className='button cool-bttn' onClick={()=>this.stop()}> Stop </button>
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
                <footer>
                    <p>By deperazar. Using the <a href='https://api.chucknorris.io'>Chuck Norris API</a></p>
                </footer>  
                
            </>
            
        );
    }        
}

export default App;
import React, {Component} from 'react';
import './App.css';
import ErrorBoundary from '../components/ErrorBoundary';
import FactsList from '../components/FactsList';
import CategorySelector from '../components/CategorySelector';
import Scroll from '../components/Scroll';
import Fact from '../components/Fact';
import chuck from '../img/chuck.png';
import 'animate.css';


class App extends Component {
    constructor(){
        super();
        this.state = {
            facts: [],
            categories: [],
            selectedCategory : '',
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

    addFact = (category, count=0) => {
        !category.length ? //If its an empty string
            fetch('https://api.chucknorris.io/jokes/random')
            .then(resp => resp.json())
            .then(newFact => this.appendIfNotRepeated(category, newFact))        
            .catch(error => console.log(error))
        :
        (
            fetch(`https://api.chucknorris.io/jokes/random?category=${category}`)  
            .then(resp => resp.json())
            .then(newFact => this.appendIfNotRepeated(category, newFact))        
            .catch(error => console.log(error))
        )
    }

    changeCategory = (category) => {
        this.setState({selectedCategory: category})
    }

    componentDidMount(){
        fetch('https://api.chucknorris.io/jokes/categories')  
        .then(resp => resp.json())
        .then(categories => this.setState({categories: categories}))
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
                <p>¡Beware! Some fun facts may be politically incorrect for some audiences</p>
                <div className='body-structure'>
                    <div className='body-doc'>
                        <img className="image animate__animated animate__jackInTheBox" src={chuck} alt="Chuck"/>
                        <button className='button cool-bttn' onClick={() => this.addFact(selectedCategory)}>Get a Random FunFact</button>
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
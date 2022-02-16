import React            from 'react';
import chuck            from '../img/chuck.png';
import Scroll           from '../components/Scroll';
import ErrorBoundary    from '../components/ErrorBoundary';
import FactsList        from '../components/FactsList';

class Body extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            facts: [],
            finishedPlaying: false,
            displayedAll: false,
            alreadyFavorite: false,
            prevCategory: 'All'
        }
    }

    checkRepetition = (factToCheck) => {
        const ids = this.state.facts.filter(fact => fact.id === factToCheck.id)
        return ids.length? true:false
    };

    async getFact (category) {
        if (category === 'All'){
            const responseFetch = await fetch('https://api.chucknorris.io/jokes/random');
            const responseJson = await responseFetch.json();
            return await responseJson;
        } else {
            const responseFetch = await fetch(`https://api.chucknorris.io/jokes/random?category=${category}`);
            const responseJson = await responseFetch.json();
            return await responseJson;
        }
    }

    async addFact (category) {
        this.setState({alreadyFavorite: false})
        let fact = await this.getFact(category);
        let count = 0;
        while (this.checkRepetition(fact) && count < 10) {//While the fact is repeated and there are less than 10 fetchs
            console.log(count)
            fact = await this.getFact(category);
            count ++;
        }
        if (count === 10){ //Too many fetches. Probably no more facts
            this.setState({displayedAll: true})
            return {id:'0', value:'No more facts'}
        } else { // Found a fact that it is not already in the facts array
            this.setState({displayedAll: false})
            this.setState({facts: [fact, ...this.state.facts]})
            return fact;
        }
    }

    async playFact (text) {
        const options = {
            key: 'ddb7eaed19ad4c66a911c6e73ccb9a19',
            language: 'en-us',
            voice: 'John',
            audioFormat: '16khz_16bit_mono',
            src: encodeURIComponent(text)
        }
        
        const audioResponse = await
            fetch(`http://api.voicerss.org/?key=${options.key}&hl=${options.language}&v=${options.voice}&c=MP3&f=${options.audioFormat}&src=${options.src}`, {            
            method: "GET"});
        const audio = new Audio(audioResponse.url);
        await audio.play();
        audio.addEventListener("ended", () => {
            console.log('Audio Ended')
            this.goAuto(this.state)
        });
    }

    async goAuto (command = 'keepGoing') {
        const {finishedPlaying, displayedAll, prevCategory} = this.state;
        const {selectedCategory} = this.props;
        if (selectedCategory !== prevCategory){// User just changed categories
            
        }
        
        if(!this.state.displayedAll && !finishedPlaying){
            const fact = await this.addFact(selectedCategory)
            this.playFact(fact.value)        
        }
    }

    stop = () => {
        console.log('Stop')
        this.setState({finishedPlaying: true})
    }

    showFavoriteFacts = () => {
        this.setState({alreadyFavorite: true})
        this.setState({facts: this.props.favoriteFacts})
    }

    render(){
        
        const {facts, displayedAll, alreadyFavorite} = this.state;
        const {selectedCategory, route, addFavoriteFact, removeFavoriteFact} = this.props;

        return (
            
            <div className='body-structure'>
                {
                    route === 'profile'
                    ?(
                        <div className='favorite-btnn' onClick={() => this.showFavoriteFacts()}><p>Show your favorite facts</p></div>
                    )
                    :(
                        <></>
                    )
                }
                
                <div className='body-doc'>
                    <img className="image animate__animated animate__jackInTheBox" src={chuck} alt="Chuck"/>
                    <div style={{width: '50%'}}>
                        <button className='main-bttn cool-bttn' onClick={() => this.addFact(selectedCategory)}>Get a Random FunFact</button>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
                            <button className='cool-bttn' onClick={()=> this.goAuto('start')}> Automatic </button>
                            <button className='cool-bttn' onClick={()=>this.stop()}> Stop </button>
                        </div>
                    </div>
                </div>
                    <Scroll>
                        {!facts.length ? 
                            <h2>No fun facts yet</h2> 
                        : (
                            <ErrorBoundary>
                                        <FactsList 
                                            facts={facts} 
                                            displayedAll={displayedAll} 
                                            addFavoriteFact={addFavoriteFact} 
                                            removeFavoriteFact={removeFavoriteFact}
                                            alreadyFavorite = {alreadyFavorite}
                                            route={route}/>
                            </ErrorBoundary>
                        )}
                    </Scroll>
            </div>
        );
    }

}

export default Body;
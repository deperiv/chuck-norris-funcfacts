import React            from 'react';
import chuck            from '../img/chuck.png';
import Scroll           from '../components/Scroll';
import ErrorBoundary    from '../components/ErrorBoundary';
import FactsList        from '../components/FactsList';
import CategorySelector from '../components/CategorySelector';

class Body extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            selectedCategory: 'All',
            facts: [],
            prevProps: this.props,
            finishedPlaying: false,
            displayedAll: false,
            alreadyFavorite: false
        }
    }
    componentDidMount(){
        this.setState({facts: []});
        fetch('https://api.chucknorris.io/jokes/categories')  
        .then(resp => resp.json())
        .then(categories => this.setState({categories: ['All', ...categories]}))
        .catch(error => console.log(error));
    }

    componentDidUpdate() { //Delete facts from fact list when signout or signin
        const {route} = this.state.prevProps;
        if (this.props.route !== route) {
            this.setState({
                selectedCategory: 'All',
                facts: [],
                prevProps: this.props,
                finishedPlaying: true,
                displayedAll: false,
                alreadyFavorite: false
            });
        }
    }

    componentWillUnmount(){
        this.stop();
    }

    changeCategory = (category) => {
        this.setState({selectedCategory: category});
        this.setState({displayedAll: false});
    }

    checkRepetition = (factToCheck) => {
        const ids = this.state.facts.filter(fact => fact.id === factToCheck.id)
        return ids.length? true:false
    }

    async getFact (category) {
        const responseFetch = await fetch('https://shrouded-sea-80504.herokuapp.com/addFact', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                category: category
            })
        });
        const responseJson = await responseFetch.json();
        return responseJson;
    }

    async addFact (category) {
        this.setState({alreadyFavorite: false})
        let fact = await this.getFact(category);
        let count = 0;
        while (this.checkRepetition(fact) && count < 10) {//While the fact is repeated and there are less than 10 fetchs
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
            voice: 'Mary',
            audioFormat: '16khz_16bit_mono',
            src: encodeURIComponent(text)
        }
        
        const audioResponse = await
            fetch(`https://api.voicerss.org/?key=${options.key}&hl=${options.language}&v=${options.voice}&c=MP3&f=${options.audioFormat}&src=${options.src}`, {            
            method: "GET"});
        const audio = new Audio(audioResponse.url);
        await audio.play();
        audio.addEventListener("ended", () => {
            this.goAuto(this.state)
        });
    }

    async goAuto (command = 'keepGoing') {
        const {finishedPlaying, displayedAll, selectedCategory} = this.state;
        if (command === 'start'){ // Automatic button has been pressed
            this.setState({finishedPlaying: false});
            const fact = await this.addFact(selectedCategory)
            this.playFact(fact.value) 
        } else {//playFact called goAuto after the audio ended
            if(!displayedAll && !finishedPlaying){
                const fact = await this.addFact(selectedCategory)
                this.playFact(fact.value)        
            }
        }
    }

    stop = () => {
        this.setState({finishedPlaying: true})
    }

    showFavoriteFacts = () => {
        this.setState({alreadyFavorite: true});
        this.setState({finishedPlaying: true});
        fetch(`https://shrouded-sea-80504.herokuapp.com/getFavorites/${this.props.userID}`, {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
        })
        .then(response => response.json())
        .then(resp => {
            if (resp === 'No favorite facts') {
                alert('No favorite facts');
            } else {
                this.setState({facts: resp.reverse()});
            }        
        })        
    }

    render(){
        const {facts, displayedAll, alreadyFavorite, categories, selectedCategory} = this.state;
        const {route, addFavoriteFact, removeFavoriteFact} = this.props;
        return (
            <div className='body-structure'>
                <CategorySelector categories={categories} selectedCategory={selectedCategory} changeCategory={this.changeCategory}/> 
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
                    <img id="ChuckIMG" className="image animate__animated animate__jackInTheBox" src={chuck} alt="Chuck"/>
                    <div className='btnn-wrapper'>
                        <button className='main-bttn cool-bttn' onClick={() => this.addFact(selectedCategory)}>Get a Random FunFact</button>
                        <div className='buttn-section'>
                            <button className='cool-bttn' onClick={()=> this.goAuto('start')}>Autoplay</button>
                            <button className='cool-bttn' onClick={()=>this.stop()}>Stop</button>
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
                                            alreadyFavorite={alreadyFavorite}
                                            route={route}/>
                            </ErrorBoundary>
                        )}
                    </Scroll>
            </div>
        );
    }
}

export default Body;
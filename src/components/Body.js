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
            repeatedCount: 0,
            displayedAll: false,
            alreadyFavorite: false
        }
    }

    checkRepetition = (factToCheck) => {
        const ids = this.state.facts.filter(fact => fact.id === factToCheck.id)
        return ids.length? true:false
    };


    //Non recursive

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

    appendIfNotRepeated = () => {

    }

    async addFact1 (category) {
        this.setState({alreadyFavorite: false})
        let fact = await this.getFact(category);
        console.log(fact)
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

    async playFact1 (text, onEndFunction = ()=>{}) {
        const options = {
            key: 'ddb7eaed19ad4c66a911c6e73ccb9a19',
            language: 'en-us',
            voice: 'Amy',
            audioFormat: '16khz_16bit_mono',
            src: encodeURIComponent(text)
        }
        
        const audioResponse = await
            fetch(`http://api.voicerss.org/?key=${options.key}&hl=${options.language}&v=${options.voice}&c=MP3&f=${options.audioFormat}&src=${options.src}`, {            
            method: "GET"});
        const audio = new Audio(audioResponse.url);
        await audio.play();
        audio.addEventListener("ended", onEndFunction);
    }


    async goAuto1 (command = 'keepGoing') {
        const {finishedPlaying, displayedAll} = this.state;
        const {selectedCategory} = this.props;
        const fact = await this.addFact1(selectedCategory);
        const play = await this.playFact(fact.value, this.goAuto);   
        

        // if (command === 'start'){ //Just pressed Automatic Button
        //     this.setState({finishedPlaying: false})
        //     this.addFact1(selectedCategory)
        //         .then(fact => {
        //             if (fact.id !== 0){
        //                 this.playFact(fact.value, this.goAuto)
        //             }
        //         })
        //         .catch(err => console.error(err));  
        // } else {
        //     if (!finishedPlaying && !displayedAll) { //If the stop button hasnt been pressed
        //         console.log('Hello there')
        //         this.addFact1(selectedCategory)
        //         .then(fact => {
        //             if (fact.id !== '0'){
        //                 console.log(fact.id)
        //                 this.playFact(fact.value, this.goAuto)
        //             }
        //         })
        //         .catch(err => console.error(err));  
        //     }
        // }
    }

    //Basic Function add fact
    //Fetch a fact
    //Already in list? fetch and try again : Append to list and return it

    // appendIfNotRepeated = (category, newFact) => {
    //     if (this.checkRepetition(newFact)){//If the fact is already in the facts array
    //         this.setState({repeatedCount: this.state.repeatedCount + 1})
    //         if (this.state.repeatedCount < 10){ //If repeatedCount < 10 try to get another fact
    //             this.addFact(category)
    //             return false
    //         } else { //If repeatedCount >= 10 all facts have been displayed
    //             this.setState({displayedAll: true})
    //             console.log('No more')
    //             return false
    //         }
    //     } else {
    //         console.log('Added', newFact.id)
    //         this.setState({displayedAll: false, repeatedCount: 0})
    //         this.setState({facts: [newFact, ...this.state.facts]})
    //         return true;
    //     }        
    // }

    // async playFact (text, onEndFunction = ()=>{}) {
    async playFact (text) {
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
            // audio.addEventListener("ended", onEndFunction);
        })
        .catch(err => console.error(err));     
    }

    async addFact (category) {
        if (category === 'All'){
            const responseFetch = await fetch('https://api.chucknorris.io/jokes/random');
            const responseJson = await responseFetch.json();
            const appended = this.appendIfNotRepeated(category, responseJson) //Appends fact if not repeated
            console.log(appended)
            return responseJson; //Shouldnt be returning if The fact is repeated. Play is going to catch it and then play it            
        } else {
            console.log(category)
            const responseFetch = await fetch(`https://api.chucknorris.io/jokes/random?category=${category}`);
            const responseJson = await responseFetch.json();
            const appended = this.appendIfNotRepeated(category, responseJson) //Appends fact if not repeated
            console.log(appended)
            if (appended){
                return responseJson; //Shouldnt be returning if The fact is repeated. Play is going to catch it and then play it            
            } 
        }
    }

    goAuto = (command = 'keepGoing') => {
        const {finishedPlaying, displayedAll} = this.state;
        const {selectedCategory} = this.props;
        if (command === 'start'){
            this.setState({finishedPlaying: false})
            this.addFact1(selectedCategory)
                .then(fact => {
                    if (fact.id !== 0){
                        this.playFact(fact.value, this.goAuto)
                    }
                })
                .catch(err => console.error(err));  
        } else {
            if (!finishedPlaying && !displayedAll) { //If the stop button hasnt been pressed
                this.addFact1(selectedCategory)
                .then(fact => {
                    if (fact.id !== 0){
                        this.playFact(fact.value, this.goAuto)
                    }
                })
                .catch(err => console.error(err));  
            }
        }
    }
 
    stop = () => {
        this.setState({finishedPlaying: true})
    }

    showFavoriteFacts = () => {
        console.log('Here')
        this.setState({alreadyFavorite: true})
        this.setState({facts: this.props.favoriteFacts})
    }

    render(){
        
        const {facts, displayedAll, alreadyFavorite} = this.state;
        const {selectedCategory, route, addFavoriteFact, removeFavoriteFact} = this.props;

        return (
            
            <div className='body-structure'>
                <div className='favorite-btnn' onClick={() => this.showFavoriteFacts()}><p>Show your favorite facts</p></div>
                <div className='body-doc'>
                    <img className="image animate__animated animate__jackInTheBox" src={chuck} alt="Chuck"/>
                    <div style={{width: '50%'}}>
                        <button className='main-bttn cool-bttn' onClick={() => this.addFact1(selectedCategory)}>Get a Random FunFact</button>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
                            <button className='cool-bttn' onClick={()=>this.goAuto1('start')}> Automatic </button>
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
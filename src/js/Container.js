import React, { Component } from 'react';
import Twitter from 'twitter';
import ToneAnalyzerV3 from 'watson-developer-cloud/tone-analyzer/v3'

import Search from './Search';
import Result from './Result';
import Config from './Config'

class AppContainer extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            twitterUser: undefined,
            userName: "",
            tweets: [],
            isLoading: false,
            showResults: false,
            displayScore: 0
        };

        this.watson = new ToneAnalyzerV3({
            username:     Config.watson.username,
            password:     Config.watson.password,
            version_date: Config.watson.version_date
        });

        this.twitter = new Twitter({
            consumer_key:        Config.twitter.consumer_key,
            consumer_secret:     Config.twitter.consumer_secret,
            access_token_key:    Config.twitter.access_token_key,
            access_token_secret: Config.twitter.access_token_secret
        });

        this.updateInterval = null;
        this.watsonResult = 0;

        this.onTextChange        = this.onTextChange.bind(this);
        this.search              = this.search.bind(this);
        this.queryTwitter        = this.queryTwitter.bind(this);
        this.processWatsonResult = this.processWatsonResult.bind(this);
        this.queryWatson         = this.queryWatson.bind(this);
        this.handleError         = this.handleError.bind(this);
        this.updateDisplayScore  = this.updateDisplayScore.bind(this);
    }

    onTextChange(selectedUser) {
        if (selectedUser){
            this.setState({
                twitterUser: selectedUser,
                userName:selectedUser.name,
                showResults: true,
                isLoading: true
            });
            this.queryTwitter(selectedUser);
        }
        else {
            this.setState({
                twitterUser: undefined,
                userName:"",
                showResults: false,
                isLoading: false
            });
        }
    }

    search(value) {
        if (!value || value === '') {
            return Promise.resolve({ options: [] });
        }

        return this.twitter.get('users/search', { q: value, count:5 })
            .then(function (users) {
                return { options: users };
            })
            .catch(this.handleError);
    }

    queryTwitter(user) {
        var _this = this;
        this.twitter.get('statuses/user_timeline', { user_id: user.id })
            .then(this.queryWatson)
            .catch(this.handleError);
    }

    queryWatson(tweets) {
        var tweetText = '';
        tweets.forEach(function (tweet) {
            tweetText = tweetText + tweet.text + ". ";
        });
        this.watson.tone({ text: tweetText, "Content-Type": "application/json" }, this.processWatsonResult);
    }

    processWatsonResult(err, tone) {
        if (err) {
            this.handleError(err);
            return;
        }
        let angerScore = tone.document_tone.tone_categories[0].tones[0].score;
        this.watsonResult = angerScore;
        this.setState({
            displayScore: 0,
            isLoading: false,
            showResults: true
        });
        if (this.updateInterval != null) {
            window.clearInterval(this.updateInterval)
        }
        let animationRefresh = (1-angerScore)*50;
        this.updateInterval = setInterval(this.updateDisplayScore,animationRefresh);
    }

    updateDisplayScore() {
        let newScore = this.state.displayScore + 0.01
        if (newScore <= this.watsonResult) {
            this.setState({
                displayScore: newScore,
            });
        }
        else {
            window.clearInterval(this.updateInterval)
        }
    }    

    handleError(error) {
        this.setState({
            isLoading: false
        });
    }

    render() {
        return (
            <div>
                <Search
                    onChange={this.onTextChange}
                    value={this.state.twitterUser}
                    handleSelect={this.queryTwitter}
                    getValues={this.search} />
                <Result 
                    header={this.state.userName} 
                    showResults={this.state.showResults} 
                    score={this.state.displayScore}
                    isLoading={this.state.isLoading} />
                
            </div>
        );
    }
}

export default AppContainer

import React, { Component } from 'react';
import Loading from 'react-loading';
import Twitter from 'twitter';
import ToneAnalyzerV3 from 'watson-developer-cloud/tone-analyzer/v3'

import Search from './Search';
import Result from './Result';
import Config from './Config'

class AppContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            twitterHandle: {},
            tweets: [],
            isLoading: false,
            showResults: false,
            watsonResult: 0
        };

        this.watson = new ToneAnalyzerV3({
            username: Config.watson_username,
            password: Config.watson_password,
            version_date: Config.watson_version_date
        });

        this.twitter = new Twitter({
            consumer_key: Config.twitter_consumer_key,
            consumer_secret: Config.twitter_consumer_secret,
            access_token_key: Config.twitter_access_token_key,
            access_token_secret: Config.twitter_access_token_secret
        });

        this.onTextChange = this.onTextChange.bind(this);
        this.search = this.search.bind(this);
        this.queryTwitter = this.queryTwitter.bind(this);
        this.quertyWatson = this.quertyWatson.bind(this);
        this.processTweets = this.processTweets.bind(this);
        this.handleError = this.handleError.bind(this);
    }

    onTextChange(value) {

        this.setState({
            twitterHandle: value,
            showResults: true,
            isLoading: true
        });

        this.queryTwitter(value);
    }


    search(value) {

        if (!value || value === '') {
            return Promise.resolve({ options: [] });
        }
        console.log('searching for ' + value);

        return this.twitter.get('users/search', { q: value, count:5 })
            .then(function (users) {
                return { options: users };
            })
            .catch(this.handleError);
    }

    queryTwitter(user) {
        console.log('pricessing result ');
        var _this = this;
        this.twitter.get('statuses/user_timeline', { user_id: user.id })
            .then(this.processTweets)
            .catch(this.handleError);
    }

    processTweets(tweets) {
        var tweetText = '';
        tweets.forEach(function (tweet) {
            tweetText = tweetText + tweet.text + ". ";
        });
        this.watson.tone({ text: tweetText, "Content-Type": "application/json" }, this.quertyWatson);
    }

    quertyWatson(err, tone) {
        if (err) {
            this.handleError(err);
            return;
        }
        let angerScore = tone.document_tone.tone_categories[0].tones[0].score;
        console.log(angerScore);
        this.setState({
            watsonResult: angerScore,
            // twitterHandle: "",
            isLoading: false,
            showResults: true
        });
    }

    handleError(error) {
        this.setState({
            isLoading: false
        });
        console.log(error);
    }

    render() {
        return (
            <div>
                <Search
                    isHidden={this.state.showResults}
                    onChange={this.onTextChange}
                    value={this.state.twitterHandle}
                    handleSelect={this.queryTwitter}
                    getValues={this.search} />
                <Result header={this.state.twitterHandle} score={this.state.watsonResult} size={200} />
                {this.state.isLoading && <div className="spinner"><Loading type="spin" color="#fc6661" height='50px' width='50px' /></div>}
            </div>
        );
    }
}

export default AppContainer

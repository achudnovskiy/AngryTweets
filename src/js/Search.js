// ES6 Component
// Import React
import React, { Component } from 'react';
import Select from 'react-select';


const AsyncComponent = Select.Async;


class Search extends Component {

    renderOption(option) {
        return (
            <div className='searchBox-option'>
                <img className="searchBox-option-image " src={option.profile_image_url} />
                <div className="searchBox-option-wrapper">
                    <p className="searchBox-option-id">{option.name}</p>
                    <p className="searchBox-option-name">@{option.screen_name}</p>
                </div>
            </div>
        );
    }
    render() {
        return (
            <div className="search">
                <p className="header">Search for the user</p>
                <Select.Async
                    className="searchBox"
                    valueKey="screen_name"
                    labelKey="screen_name"
                    value={this.props.value}
                    onChange={this.props.onChange}
                    loadOptions={this.props.getValues}
                    optionRenderer={this.renderOption}
                    multi={false}
                    backspaceRemoves={false}
                    autosize={false}
                    openOnFocus={true}
                />
            </div>
        );
    }
}

export default Search

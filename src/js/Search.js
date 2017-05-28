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
        console.log(this.props.isHidden);
        const classNames = ['searchBox'];
        if (this.props.isHidden) { classNames.push('searchBox-hidden'); }

        return (
            <div>
                <h1>Hate Speech analyzer</h1>
                <AsyncComponent
                    className={classNames.join(' ')}
                    valueKey="id"
                    labelKey="screen_name"
                    value={this.props.value}
                    onChange={this.props.onChange}
                    selectValue={this.props.handleSelect}
                    loadOptions={this.props.getValues}
                    clearRenderer={function () { }}
                    // searchable={!this.props.isHidden}
                    valueRenderer={function () { }}
                    optionRenderer={this.renderOption}
                    addLabelText=""
                    clearAllText=""
                    clearValueText=""
                    noResultsText=""
                    searchPromptText=""
                    loadingPlaceholder=""
                    placeholder=""
                    searchingText=""
                    multi={false}
                    backspaceRemoves={false}
                    autosize={false}
                    onCloseResetsInput={false}
                    openOnFocus={true}
                />
            </div>
        );
    }
}

export default Search

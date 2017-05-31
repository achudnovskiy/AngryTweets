import React, { Component } from 'react';
import Loading from 'react-loading';

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(x, y, radius, startAngle, endAngle) {

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;
}

class SVGComponent extends Component {
    render() {
        return <svg {...this.props}>{this.props.children}</svg>;
    }
}

class SVGPath extends Component {
    render () {
        return <path {...this.props}>{this.props.children}</path>;
    }
}

class Result extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let scoreVal = parseInt(this.props.score * 100);
        let adj = scoreVal.toString().length == 1 ? 6 : 0;
        return (
            <div className="result">
                {this.props.showResults && <p className="header">Score for <b>{this.props.header}</b></p>}
                {!this.props.showResults && <p className="header">No user selected</p>}
                <div className="result-score">
                    {this.props.isLoading && <div className="spinner"><Loading type="spin" color="#fc6661" height='100px' width='100px' /></div>}
                    {!this.props.isLoading && 
                        <SVGComponent height={150}
                            width={150}>
                            <circle className="result-path-outline" r={75} cx={75} cy={75}></circle>
                            <SVGPath className="result-path" d={describeArc(75, 75, 75, 0, (parseInt(this.props.score * 360)))}></SVGPath>
                            <text x={50+adj} y={85}>{scoreVal+"%"}</text>
                        </SVGComponent>}
                </div>
            </div>
        );
    }
}

export default Result

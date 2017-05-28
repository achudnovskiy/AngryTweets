import React, { Component } from 'react';

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

var SVGComponent = React.createClass({
    render: function () {
        return <svg {...this.props}>{this.props.children}</svg>;
    }
});
var SVGPath = React.createClass({
    render: function () {
        return <path {...this.props}>{this.props.children}</path>;
    }
});

class Result extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props);
        return (
            <div>
                <h1>Results for {this.props.header.name}</h1>
                <div className="searchResult">
                    <SVGComponent height={150}
                        width={150}>
                        <SVGPath d={describeArc(75, 75, 75, 0, (parseInt(this.props.score * 360)))}>
                        </SVGPath>
                        <text x={35} y={60}>{parseInt(this.props.score * 100)+"%"}</text>
                    </SVGComponent>
                </div>
            </div>
        );
    }
}

export default Result

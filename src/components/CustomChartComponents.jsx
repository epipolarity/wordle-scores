export function CustomBar(props) {
    const { x, y, width, height, payload } = props;
    const imageUrl = process.env.PUBLIC_URL + '/images/' + payload.img;
    const imgSize = 40;
    const imgX = x + (width - imgSize) / 2;
    const imgY = y;
    const barY = y + imgSize;
    const barHeight = height - imgSize;
    const textY = barY + barHeight / 2;

    const scoreTextStyle = { fontSize: '16px', fontWeight: 'bold', fontFamily: 'Arial' };

    if (barHeight > 0) {
        return (
            <g>
                <rect x={x} y={barY} width={width} height={barHeight} fill={payload.fill} />
                <image href={imageUrl} x={imgX} y={imgY} width={imgSize} height={imgSize} />
                <text x={x + width / 2} y={textY} textAnchor="middle" fill="#000" style={scoreTextStyle}>{payload.mean.toFixed(2)}</text>
            </g>
        );
    }
}

export function HistCountLabel(props) {
    const { x, y, width, height, value } = props;
    return (
        <text x={x + width} y={y} dy={height * 0.75} dx={-height / 5} fontWeight="bold" fill="white" fontSize={height * 0.8} textAnchor="end">
            {value > 0 ? value : ''}
        </text>
    );

}

export function DistAxisLabel(props) {
    const { x: left, y: top, width, height } = props.viewBox;

    const x = left - 10 + width / 2;
    const y = top + 10 + height / 2;

    return (
        <text x={x} y={y} transform={`rotate(-90,${x},${y})`} fill="black" fontWeight="bold" fontSize={16} textAnchor="middle">
            SCORE DISTRIBUTION
        </text>
    );
}
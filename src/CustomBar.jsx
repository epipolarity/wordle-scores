function CustomBar(props) {
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
    return null;
}

export default CustomBar;
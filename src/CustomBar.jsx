function CustomBar(props) {
    const { x, y, width, height, payload } = props;
    const imageUrl = process.env.PUBLIC_URL + '/images/' + payload.img;
    const imgSize = 40;
    const imgX = x + (width - imgSize) / 2;
    const imgY = y;
    const barY = y + imgSize;
    const barHeight = height - imgSize;
    const textY = barY + barHeight / 2;
    if (barHeight > 0) {
        return (
            <g>
                <rect x={x} y={barY} width={width} height={barHeight} fill={payload.fill} />
                <image href={imageUrl} x={imgX} y={imgY} width={imgSize} height={imgSize} />
                <text x={x + width / 2} y={textY} textAnchor="middle" fill="#000" style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: 'Arial' }}>{payload.mean.toFixed(2)}</text>
                <text x={x + width / 2} y={textY + 15} textAnchor="middle" fill="#000" style={{ fontSize: '12px', fontStyle: 'italic', fontFamily: 'Arial' }}>{payload.missed > 0 ? '-' : ''}{payload.missed}</text>
            </g>
        );
    }
    return null;
}

export default CustomBar;
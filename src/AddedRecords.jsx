function AddedRecords({ records, onBack }) {
    return (
        <div id="addedRecordsContainer">
            <div>Records added:</div>
            <div>
                {records.map((record, index) => {
                    return (
                        <p key={index}>
                            {record}
                        </p>
                    );
                })}
            </div>
            <button onClick={onBack}>Back to Scores</button>
        </div>
    );
}

export default AddedRecords;
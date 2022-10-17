const styles = theme => ({
    formContainer: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chaloContainer: {
        display : 'flex',
        align: 'center',
        flexDirection: 'column',
        margin: '10px 20px 40px 20px'
    },
    filterIcon: {
        // marginTop: "50px",
        marginTop : "30px",
        position: "absolute"
    },
    header:{
        fontSize : '20px',
        color : '#666',
    },
    headerField: {
        fontSize: '16x',
        color: 'black',
        margin: '5px',
        fontWeight: 'bold',
    },
    inputField: {
        marginTop: "5px",
        marginLeft: '0px',
        width: '250px'
    },
    inputSelect: {
        marginTop: "5px",
        width: '150px'
    },
    resetButton: {
        width: "100%",
        marginTop: "15px",
        color: "white"
    },
    "@media (max-width: 768px)": {
        chaloContainer: {
            width: "100%",
            padding: "10px"
        },
        inputField: {
            width: "100%",
            padding: "10px"
        },
        filterIcon: {
            display: "none"
        },
    }
})

export default styles;
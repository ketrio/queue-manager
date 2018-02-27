export default theme => ({
    container: {
        width: '100%',
        maxWidth: 975,
        margin: '0 auto',
        padding: '80px 15px 0'
    },
    appbarHeading: {
        flex: 1
    },
    progress: {
        margin: '0 auto 20px',
        display: 'block'
    },
    list: {
        backgroundColor: theme.palette.background.paper
    },
    listSection: {
        backgroundColor: theme.palette.background.paper,
        top: 64,
        'z-index': 10,
        [theme.breakpoints.down('sm')]: {
            top: 56
        }
    },
    listSubSection: {
        backgroundColor: theme.palette.background.paper,
        top: 104,
        [theme.breakpoints.down('sm')]: {
            top: 96
        }
    },
});

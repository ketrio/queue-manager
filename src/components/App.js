import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import SvgIcon from 'material-ui/SvgIcon';
import IconButton from 'material-ui/IconButton';
import { CircularProgress } from 'material-ui/Progress';
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import ListSubheader from 'material-ui/List/ListSubheader';

import AccountCircle from 'material-ui-icons/AccountCircle';

import { getSubjects } from '../api/API';
import { daterandom, shuffle } from '../api/random';
import students from '../students.json';
import styles from './styles';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { queue: [], fetching: false };
        this.getSubjects = this.getSubjects.bind(this);
    }

    getSubjects() {
        this.setState({
            fetching: true
        });
        getSubjects()
            .then(res => {
                const queue = res.map(schedule => ({
                    subjects: schedule.subjects.map(subj => Object.assign({
                        students:  shuffle(daterandom(schedule.date), students
                            .slice()
                            .filter(student => subj.subgroup === 0 || student.subgroup === subj.subgroup)
                            .map(student => student.name))
                    }, subj)),
                    date: schedule.date
                }));
                this.setState({
                    queue,
                    fetching: false
                });
            });
    }

    componentDidMount() {
        this.getSubjects();
    }

    render() {
        const {classes} = this.props;
        return(
            <div>
                <AppBar position="fixed">
                    <Toolbar>
                        <Typography variant="title" color="inherit" className={classes.appbarHeading}>
                            Queue manager v1.1
                        </Typography>
                        <IconButton rel='noopener noreferrer' target='_blank' href='https://github.com/ketrio/queue-manager' className={classes.menuButton} color="inherit" aria-label="Menu">
                            <SvgIcon color="inherit" aria-label="Shuffle">
                                <svg aria-hidden="true" height="24" version="1.1" viewBox="0 0 16 16" width="24">
                                    <path fill="#fff" fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
                                </svg>
                            </SvgIcon>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <div className={classes.container}>
                    {
                        this.state.queue.length == 0 && this.state.fetching
                            ? <CircularProgress className={classes.progress} />
                            : ''
                    }
                    {this.state.queue.map(e => (
                        <List dense className={classes.list} subheader={<li />} key={e.date.toDateString()}>
                            <ListSubheader color='primary' className={classes.listSection}>{e.date.toLocaleDateString('ru-RU')}</ListSubheader>
                            <li>{e.subjects.map(subj => (
                                <ul key={`${e.date.toDateString()}_${subj.name}_${subj.subgroup}`}>
                                    <ListSubheader className={classes.listSubSection}>
                                        {`${subj.name} (${subj.subgroup ? `подгруппа ${subj.subgroup}` : 'вся группа'})`}
                                    </ListSubheader>
                                    {subj.students.map((student, i) => (
                                        <ListItem button key={`${e.date.toDateString()}_${subj.name}_${subj.subgroup}_${student}`}>
                                            <ListItemIcon><AccountCircle /></ListItemIcon>
                                            <ListItemText className={classes.appbarHeading} primary={student} />
                                            <Typography variant='subheading'>{`#${i + 1}`}</Typography>
                                        </ListItem>
                                    ))}
                                </ul>
                            ))}</li>
                        </List>
                    ))}
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(App);

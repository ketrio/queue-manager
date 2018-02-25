import React, { Component } from 'react';
import {
    Toolbar, 
    ToolbarTitle, 
    ToolbarRow, 
    ToolbarFixedAdjust, 
    ToolbarSection, 
    ToolbarIcon
} from 'rmwc/Toolbar';
import {
    List,
    SimpleListItem
} from 'rmwc/List';
import { LinearProgress } from 'rmwc/LinearProgress';
import { Typography } from 'rmwc/Typography';
import { Icon } from 'rmwc/Icon';
import { getSubjects } from '../api/API';
import { daterandom, shuffle } from '../api/random';
import students from '../students.json';
import '../style.scss';

export default class App extends Component {
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

    render() {
        return(
            <div>
                <Toolbar fixed waterfall>
                    <ToolbarRow>
                        {
                            this.state.fetching 
                                ? <LinearProgress className='sticky-progress' determinate={false}></LinearProgress>
                                : ''
                        }
                        <ToolbarSection alignStart>
                            <ToolbarTitle>Queue manager v1</ToolbarTitle>
                        </ToolbarSection>
                        <ToolbarSection alignEnd>
                            <ToolbarIcon onClick={this.getSubjects} use="shuffle"/>
                        </ToolbarSection>
                    </ToolbarRow>
                </Toolbar>
                <ToolbarFixedAdjust />
                <div className='container'>
                    {
                        this.state.queue.length == 0
                            ? <Typography use='title'>Нажмите <Icon strategy="ligature" use="shuffle" /> чтобы перемешать группу</Typography>
                            : ''
                    }
                    {this.state.queue.map(e => (
                        <div key={e.date.toDateString()}>
                            <Typography className='sticky-header' use='title'>{e.date.toLocaleDateString()}</Typography>
                            {e.subjects.map(subj => (
                                <div key={`${e.date.toDateString()}_${subj.name}_${subj.subgroup}`}>
                                    <Typography className='sticky-subheader' use='subheading1'>
                                        {`${subj.name} (${subj.subgroup ? `подгруппа ${subj.subgroup}` : 'вся группа'})`}
                                    </Typography>
                                    {subj.students.map((student, i) => (
                                        <List key={`${e.date.toDateString()}_${subj.name}_${subj.subgroup}_${student}`}>
                                            <SimpleListItem graphic='face' text={student} secondaryText={`#${i}`} />
                                        </List>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

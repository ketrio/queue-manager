import { filterWeeknum, getSubjects } from './API';
import { shuffle, daterandom } from './random';
import students from './students.json'

getSubjects(1).then(res => {
  const queue = res.schedules.map(schedule => {
    const rnd = daterandom(schedule.date);
    const order = schedule.subjects.map(subject => ({subject, line: shuffle(rnd, students)}));
    return {order, date: schedule.date};
  });
  console.log(queue);
});

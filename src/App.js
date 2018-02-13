import { filterSubgroup, getSubjects } from './API';
import { shuffle, daterandom } from './random';
import students from './students.json';

getSubjects(1).then(res => {
  const queue = res.schedules.map(schedule => {
    const rnd = daterandom(schedule.date);
    const order = schedule.subjects.map(subject => {
      let currentStudents = students.slice();
      if (subject.subgroup > 0) {
        currentStudents = students.filter(
          student => student.subgroup === subject.subgroup
        );
      }
      currentStudents = currentStudents.map(student => student.name);
      return { subject, line: shuffle(rnd, currentStudents) };
    });
    return { order, date: schedule.date };
  });
});

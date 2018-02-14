import { filterSubgroup, getSubjects } from './API';
import { shuffle, daterandom } from './random';
import students from './students.json';

getSubjects(1).then(res => {
  console.log('res', res);
  const queue = res.map(schedule => {
    const rnd = daterandom(schedule.date);
    const subjects = schedule.subjects.map(subject => {
      let currentStudents = students.slice();
      if (subject.subgroup > 0) {
        currentStudents = students.filter(
          student => student.subgroup === subject.subgroup
        );
      }
      currentStudents = currentStudents.map(student => student.name);
      return Object.assign({ students: currentStudents }, subject);
    });
    return { subjects, date: schedule.date };
  });
  console.log(queue);
});

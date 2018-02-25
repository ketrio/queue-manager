const filterSubgroup = (schedules, subgroup) =>
  schedules.map(schedule =>
    schedule.subjects.filter(subject =>
      [0, subject.subgroup].includes(subgroup)
    )
  );

function* getSubject(schedules, weekNumber, count) {
  let date = new Date();
  let returned = 0;
  while (returned !== count) {
    const subjects = schedules[date.getDay() - 1]
      ? schedules[date.getDay() - 1].schedule.filter(
          e => e.weekNumber.includes(weekNumber) && e.lessonType === 'ЛР'
        )
          .map(subject => ({
            name: subject.subject,
            subgroup: subject.numSubgroup,
          }))
      : [];
    if (subjects.length > 0) {
      yield { date: new Date(date), subjects };
      returned++;
    }
    date.setDate(date.getDate() + 1);
    if (date.getDay() === 0) {
      weekNumber = (weekNumber + 1) % 4 || 1;
    }
  }
}

const getSubjects = () => {
  return new Promise((resolve, reject) => {
    fetch(
      'https://students.bsuir.by/api/v1/studentGroup/schedule?studentGroup=653505',
      { Accept: 'application/json' }
    )
      .then(res => res.json())
      .catch(reject)
      .then(res => {
        resolve(Array.from(getSubject(res.schedules, res.currentWeekNumber, 7)));
      });
  });
};

export { filterSubgroup, getSubjects };

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
    const subjects = schedules[date.getDay()]
      ? schedules[date.getDay()].schedule.filter(
          e => e.weekNumber.includes(weekNumber) && e.lessonType === "ЛР"
        )
      : [];
    if (subjects && subjects.length > 0) {
      yield { date: new Date(date), subjects };
      returned++;
    }
    date.setDate(date.getDate() + 1);
    if (date.getDay() === 0) {
      weekNumber = (weekNumber + 1) % 4 || 1;
    }
  }
}

const getSubjects = weekNumber => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.onerror = reject;
    request.onreadystatechange = function() {
      if (this.readyState === 4 && this.status == 200) {
        const response = JSON.parse(this.response);
        const schedules = Array.from(
          getSubject(response.schedules, response.weekNumber, 7)
        );
        resolve(schedules);
      }
    };
    request.open(
      'GET',
      'https://students.bsuir.by/api/v1/studentGroup/schedule?studentGroup=653505',
      true
    );
    request.setRequestHeader('Accept', 'application/json');
    request.send();
  });
};

export { filterSubgroup, getSubjects };

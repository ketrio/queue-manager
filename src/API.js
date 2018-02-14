const filterSubgroup = (schedules, subgroup) =>
  schedules.map(schedule =>
    schedule.order.filter(subject =>
      [0, subject.subject.subgroup].includes(subgroup)
    )
  );

const getSubjects = weekNumber => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.onerror = reject;
    request.onreadystatechange = function() {
      if (this.readyState === 4 && this.status == 200) {
        const response = JSON.parse(this.response);
        const weekNumber = response.currentWeekNumber;
        const schedules = response.schedules
          .slice(new Date().getDay() - 1 || 1)
          .map(schedule =>
            schedule.schedule.filter(
              e => e.weekNumber.includes(weekNumber) && e.lessonType === 'ЛР'
            )
          )
          .map(schedule =>
            schedule.map(period => ({
              name: period.subject,
              subgroup: period.numSubgroup,
            }))
          )
          .filter(schedule => schedule.length > 0)
          .map((subjects, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            return { date, subjects };
          });
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

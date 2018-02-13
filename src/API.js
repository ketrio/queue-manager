const filterWeeknum = (schedules, weekNumber) =>
  schedules.map(schedule =>
    schedule.filter(subject => subject['weekNumber'].includes(weekNumber))
  );

const getSubjects = (subgroup, weekNumber) => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.onerror = reject;
    request.onreadystatechange = function() {
      if (this.readyState === 4 && this.status == 200) {
        const response = JSON.parse(this.response);
        const weekNumber = response['currentWeekNumber'];
        const schedules = response['schedules']
          .slice(new Date().getDay() - 1 || 1)
          .map(schedule =>
            schedule.schedule.filter(
              e =>
                [0, subgroup].includes(e.numSubgroup) && e.lessonType === 'ЛР'
            )
          )
          .map(schedule => schedule.map(period => period.subject))
          .filter(schedule => schedule.length > 0)
          .map((subjects, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            return { date, subjects };
          });
        resolve({ weekNumber, schedules });
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

export { filterWeeknum, getSubjects };

const shiftDay = shift => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + shift);
  return currentDate;
};

const clear = schedules =>
  schedules.map(schedule =>
    schedule.map(period => {
      return {
        subject: period.subject,
        subgroup: period.numSubgroup,
      };
    })
  );

const filterWeeknum = (schedules, weekNumber) =>
  schedules.map(schedule =>
    schedule.filter(subject => subject['weekNumber'].includes(weekNumber))
  );

const getSubjects = subgroup => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (this.readyState === 4 && this.status == 200) {
        const response = JSON.parse(this.responseText);
        const weekNumber = response['currentWeekNumber'];
        const schedules = response['schedules']
          .slice(new Date().getDay() - 1 || 1)
          .map(schedule =>
            schedule.schedule.filter(
              e =>
                [0, subgroup].includes(e.numSubgroup) && e.lessonType === 'ЛР'
            )
          )
          .map((schedule, i) => {
            return { date: shiftDay(i), schedule };
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

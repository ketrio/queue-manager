function getSubjects(subgroup) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (this.readyState === 4 && this.status == 200) {
        const response = JSON.parse(this.responseText);
        console.log(response);
        const weekNumber = response["currentWeekNumber"];
        const schedules = response["schedules"].map(schedule =>
          schedule.schedule.filter(e => [0, subgroup].includes(e.numSubgroup))
        );
        resolve({ weekNumber, schedules });
      }
    };
    request.open(
      "GET",
      "https://students.bsuir.by/api/v1/studentGroup/schedule?studentGroup=653505",
      true
    );
    request.setRequestHeader("Accept", "application/json");
    request.send();
  });
}

const filterWeeknum = (schedules, weekNumber) =>
  schedules.map(schedule =>
    schedule.filter(subject => subject["weekNumber"].includes(weekNumber))
  );

const clear = schedules =>
  schedules.map(schedule =>
    schedule.map(period => {
      return {
        subject: period.subject,
        subgroup: period.numSubgroup,
      };
    })
  );

window.addEventListener('DOMContentLoaded', function() {
  let students = [{name: 'Иван', surname: 'Стромилов', patronymic: 'Алексеевич', dateBirth: new Date(2001, 5, 24), yearStudy: 2019, faculty: 'ФЭУ'},
                  {name: 'Петр', surname: 'Фомин', patronymic: 'Петрович', dateBirth: new Date(1999, 8, 15), yearStudy: 2021, faculty: 'ФИТ'},
                  {name: 'Анастасия', surname: 'Ильина', patronymic: 'Андреевна', dateBirth: new Date(2005, 9, 28), yearStudy: 2020, faculty: 'ФАУ'}];
  const table = document.querySelector('.main-table__body');
  const title = document.querySelectorAll('.main-table__btn');
  const form = document.querySelector('.main__form');
  let column = 'fio';
  let columnDir = true;

  //Получить ФИО
  function getFIO(student) {
    return student.surname + ' ' + student.name + ' ' + student.patronymic;
  }

  //Получить возраст
  function getAge(student) {
    let currentYear = new Date().getFullYear();
    let dd = student.dateBirth.getDate();
    let mm = student.dateBirth.getMonth() + 1;
    const yyyy = student.dateBirth.getFullYear();
    let age =  currentYear - yyyy;
    let lastNumberAge = age % 10;
    let ageRepresentation;

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    if (lastNumberAge === 1) {
      ageRepresentation = 'год';
    } else if (lastNumberAge >= 2 && lastNumberAge <= 4) {
      ageRepresentation = 'года';
    } else if ((lastNumberAge === 0) || (lastNumberAge >= 5 && lastNumberAge <= 9)) {
      ageRepresentation = 'лет';
    }

    return `${dd}.${mm}.${yyyy} (${age} ${ageRepresentation})`;
  }

  //Получить годы обучения
  function getYearsStudy(student) {
    const today = new Date();
    let currentYear = new Date().getFullYear();
    let yaerEndStudy = student.yearStudy + 4;
    let course = currentYear - student.yearStudy;

    if (student.yearStudy === currentYear) {
      course = 1;
    }

    if(today.getMonth() >= 8 && student.yearStudy !== currentYear) {
      course++;
    }

    if (today.getMonth() >= 8 && yaerEndStudy === currentYear) {
      course = 'Закончил';
    }

    if (Number(course)) {
      return `${student.yearStudy}-${yaerEndStudy} (${course} курс)`;
    } else return `${student.yearStudy}-${yaerEndStudy} (${course})`;
  }

  //Создание нового студента
  function newStudent(student) {
    const studentTR = document.createElement('tr'),
          fioTD = document.createElement('td'),
          dateBirthTD = document.createElement('td'),
          yearStudyTD = document.createElement('td'),
          facultyTD = document.createElement('td');

    fioTD.textContent = getFIO(student);
    facultyTD.textContent = student.faculty;
    dateBirthTD.textContent = getAge(student);
    yearStudyTD.textContent = getYearsStudy(student);

    studentTR.append(fioTD);
    studentTR.append(facultyTD);
    studentTR.append(dateBirthTD);
    studentTR.append(yearStudyTD);


    return studentTR;
  }

  //Отрсовка таблицы
  function render(arr) {
    let copy = arr.slice();
    copy = sortStudents(column, columnDir);

    table.innerHTML = '';

    const fioValue = document.getElementById('input-fio').value;
    const facultyValue = document.getElementById('input-faculty').value;
    const startStudyValue = document.getElementById('input-start').value;
    const endStudyValue = document.getElementById('input-end').value;

    if (fioValue !== '') copy = filter(copy, 'fio', fioValue);
    if (facultyValue !== '') copy = filter(copy, 'faculty', facultyValue);
    if (startStudyValue !== '') copy = filter(copy, 'yearStudy', startStudyValue);
    if (endStudyValue !== '') copy = filter(copy, 'endStudy', endStudyValue);

    for (let item of copy) {
      item.endStudy = item.yearStudy + 4;
      item.fio = getFIO(item);
      table.append(newStudent(item));
    }
  }

  //Сортировка студентов
  function sortStudents(prop, dir) {
    const studentsCopy = students.slice();
    return studentsCopy.sort(function (a, b) {
      if((!dir == false ? a[prop] < b[prop] : a[prop] > b[prop])) {
        return -1;
      }
    })
  }

  //Добавление описания ошибок при валидации
  function addError(strError) {
    const btns = document.querySelector('.main__btns');
    const error = document.createElement('div');
    error.classList.add('error');
    error.textContent = strError;
    btns.append(error);
  }

  //Фильрация массива
  function filter(arr, prop, value) {
    let result = [];
    let arrCopy = arr.slice();

    for (let item of arrCopy) {
      if (String(item[prop]).includes(value) == true) {
        result.push(item);
      }
    }

    return result;
  }

  render(students);

  //Сортировка при нажатии на заголовки таблицы
  for (let elem of title) {
    elem.addEventListener('click', function() {
      column = this.dataset.column;
      columnDir = !columnDir;
      render(students);
    })
  }

  //Добавление студента
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const error = document.querySelectorAll('.error');

    for (let el of error) {
      el.remove();
    }

    let flag = true;

    const inputDateBirth = document.querySelector('.main__input-birth');
    const inputYearStudy = document.querySelector('.main__input-start');

    let dd = new Date().getDate();
    let mm = new Date().getMonth() + 1;
    let yyyy = new Date().getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    //Валидация формы
    const allInput = document.querySelectorAll('.main__input');

    for (let elem of allInput) {
      if (elem.value.trim()) {
        elem.setAttribute('required', '');
      } else {
        addError('Заполните все поля!');
        flag = false;
        return;
      }
    }

    inputDateBirth.setAttribute('min', '1900-01-01');
    inputDateBirth.setAttribute('max', `${yyyy}-${mm}-${dd}`);
    inputYearStudy.setAttribute('min', '2000');
    inputYearStudy.setAttribute('max', new Date().getFullYear());

    if (inputDateBirth.value <= inputDateBirth.getAttribute('min')) {
      flag = false;
      addError('Дата рождения должна быть не менее 01.01.1900!');
    } else if (inputDateBirth.value > inputDateBirth.getAttribute('max')) {
      flag = false;
      addError('Дата рождения должна быть не больше текущей даты!');
    }

    if (inputYearStudy.value <= inputYearStudy.getAttribute('min')) {
      flag = false;
      addError('Год обучения должен быть не менее 2000 года!');
    } else if (inputYearStudy.value > inputYearStudy.getAttribute('max')) {
      flag = false;
      addError(`Год обучения должен быть не более ${new Date().getFullYear()} года!`);
    }

    if (flag) {
      let student = {
        name: document.querySelector('.main__input-name').value,
        surname: document.querySelector('.main__input-surname').value,
        patronymic: document.querySelector('.main__input-patronymic').value,
        dateBirth: new Date(inputDateBirth.value),
        yearStudy: Number(inputYearStudy.value),
        faculty: document.querySelector('.main__input-faculty').value
      }

      students.push(student);
      render(students);

      for (let elem of allInput) {
        elem.value = '';
      }
    }

  })

  //Отрисовка таблицы по событию ввода в форме фильтрации
  const filterInput = document.querySelectorAll('.main-filter__input');

  for (let input of filterInput) {
    input.addEventListener('input', function() {
      render(students);
    })
  }
})

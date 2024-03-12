//оголошення змінних
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput'); // Елемент введення для нових завдань
    const addTaskBtn = document.getElementById('addTaskBtn'); // Кнопка додавання завдань
    const clearAllBtn = document.getElementById('clearAllBtn'); // Кнопка для видалення всіх завдань
    const toggleAllBtn = document.getElementById('toggleAllBtn'); // Кнопка для відмітки всіх завдань як викнані
    const taskList = document.getElementById('taskList'); // Список завдань
    const weatherWidget = document.getElementById('weather-widget'); // Віджет погоди
    const listSelect = document.getElementById('listSelect'); // Вибір списку справ
    const createListBtn = document.getElementById('createListBtn'); // Кнопка для створення нового списку
    const deleteListBtn = document.getElementById('deleteListBtn'); // Кнопка для видалення вибраного списку
    const listHeader = document.createElement('div'); // Заголовок списку
    listHeader.classList.add('list-header'); //клас для стилізації
    document.querySelector('.container').insertBefore(listHeader, taskList);

    //додавання віджету погоди
    weatherWidget.innerHTML = `
        <iframe src="https://api.wo-cloud.com/content/widget/?geoObjectKey=2434904&language=uk&region=UA&timeFormat=HH:mm&windUnit=mps&systemOfMeasurement=metric&temperatureUnit=celsius" 
        name="CW2" scrolling="no" width="150" height="166" frameborder="0" style="border: 1px solid #00537F; border-radius: 14px;"></iframe>
    `;

    // Списки справ
    let lists = {}; // Об'єкт для збереження списків справ
    let currentList = null; // Поточний список справ

    // Збереження в LocalStorage
    function saveLists() {
        localStorage.setItem('lists', JSON.stringify(lists));
    }

    // Завдання у списку
    function renderTasks() {
        taskList.innerHTML = ''; // початкова очистка списку
        if (currentList) {
            currentList.tasks.forEach((task, index) => {
                const li = document.createElement('li'); // нове завдання
                const checkbox = document.createElement('input'); // чекбокс виконання
                checkbox.type = 'checkbox';
                checkbox.checked = task.completed;
                const label = document.createElement('label'); 
                label.textContent = task.description;
                li.appendChild(checkbox);
                li.appendChild(label);
                li.classList.toggle('completed', task.completed); // клас "completed", якщо таск виконано
                checkbox.addEventListener('change', () => {
                    task.completed = checkbox.checked;
                    saveLists();
                    renderTasks();
                });
                const deleteButton = document.createElement('button'); //видалення завдання
                deleteButton.textContent = 'U+1F6AE';
                deleteButton.classList.add('delete-btn'); // клас для стилізації кнопки
                deleteButton.addEventListener('click', () => {
                    currentList.tasks.splice(index, 1);
                    saveLists();
                    renderTasks();
                });
                li.appendChild(deleteButton);
                taskList.appendChild(li); // Додавання елемента списку до DOM
            });
        }
    }

    // Завантажується список справ
    function loadList(name) {
        if (lists[name]) {
            currentList = lists[name];
            listHeader.textContent = `Список справ: ${name}`; // Встановлюємо заголовок списку
            listHeader.style.display = 'block'; // Відображаємо заголовок
            renderTasks();
        }
    }

    // апдейт випадаючого списку
    function updateListSelect() {
        listSelect.innerHTML = '<option value="" selected disabled>Оберіть список</option>';
        for (let name in lists) {
            const option = document.createElement('option'); // новий елемент
            option.textContent = name;
            listSelect.appendChild(option); // Додавання елементу
        }
    }

    // Завантаження списків з localstorage
    const storedLists = JSON.parse(localStorage.getItem('lists'));
    if (storedLists) {
        lists = storedLists;
        updateListSelect();
        if (listSelect.options.length > 0) {
            loadList(listSelect.options[0].textContent);
        }
    }

    // обробник подіі нового завдання
    addTaskBtn.addEventListener('click', () => {
        const description = taskInput.value.trim();
        if (description && currentList) {
            currentList.tasks.push({ description, completed: false });
            saveLists();
            renderTasks();
            taskInput.value = ''; // очистка інпута після додавання завдання
        }
    });

    // очистка завдань
    clearAllBtn.addEventListener('click', () => {
        if (currentList) {
            currentList.tasks = [];
            saveLists();
            renderTasks();
        }
    });

    // всі завдвння виконані
    toggleAllBtn.addEventListener('click', () => {
        if (currentList) {
            currentList.tasks.forEach(task => {
                task.completed = true;
            });
            saveLists();
            renderTasks();
        }
    });

    // вибір списку зі списків
    listSelect.addEventListener('change', () => {
        const selectedListName = listSelect.value;
        loadList(selectedListName);
    });

    // створення нового списку
    createListBtn.addEventListener('click', () => {
        const listName = prompt('Введіть назву нового списку:');
        if (listName && !lists[listName]) {
            lists[listName] = { tasks: [] };
            updateListSelect();
            listSelect.value = listName;
            saveLists();
            loadList(listName);
        }
    });

    // видалення поточного списку
    deleteListBtn.addEventListener('click', () => {
        const selectedListName = listSelect.value;
        if (selectedListName) {
            delete lists[selectedListName];
            updateListSelect();
            saveLists();
            currentList = null;
            renderTasks();
            listHeader.textContent = '';
            listHeader.style.display = 'none';
        }
    });
});

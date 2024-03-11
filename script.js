document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const toggleAllBtn = document.getElementById('toggleAllBtn');
    const taskList = document.getElementById('taskList');
    const weatherWidget = document.getElementById('weather-widget');
    const listSelect = document.getElementById('listSelect');
    const createListBtn = document.getElementById('createListBtn');
    const deleteListBtn = document.getElementById('deleteListBtn');
    const listHeader = document.createElement('div');
    listHeader.classList.add('list-header');
    document.querySelector('.container').insertBefore(listHeader, taskList);

    // Віджет погоди
    weatherWidget.innerHTML = `
        <iframe src="https://api.wo-cloud.com/content/widget/?geoObjectKey=2434904&language=uk&region=UA&timeFormat=HH:mm&windUnit=mps&systemOfMeasurement=metric&temperatureUnit=celsius" 
        name="CW2" scrolling="no" width="150" height="166" frameborder="0" style="border: 1px solid #00537F; border-radius: 14px;"></iframe>
    `;

    let lists = {};
    let currentList = null;

    function saveLists() {
        localStorage.setItem('lists', JSON.stringify(lists));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        if (currentList) {
            currentList.tasks.forEach((task, index) => {
                const li = document.createElement('li');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = task.completed;
                const label = document.createElement('label');
                label.textContent = task.description;
                li.appendChild(checkbox);
                li.appendChild(label);
                li.classList.toggle('completed', task.completed);
                checkbox.addEventListener('change', () => {
                    task.completed = checkbox.checked;
                    saveLists();
                    renderTasks();
                });
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '❌';
                deleteButton.classList.add('delete-btn');
                deleteButton.addEventListener('click', () => {
                    currentList.tasks.splice(index, 1);
                    saveLists();
                    renderTasks();
                });
                li.appendChild(deleteButton);
                taskList.appendChild(li);
            });
        }
    }

    function loadList(name) {
        if (lists[name]) {
            currentList = lists[name];
            listHeader.textContent = `Список справ: ${name}`;
            listHeader.style.display = 'block';
            renderTasks();
        }
    }

    function updateListSelect() {
        listSelect.innerHTML = '<option value="" selected disabled>Оберіть список</option>';
        for (let name in lists) {
            const option = document.createElement('option');
            option.textContent = name;
            listSelect.appendChild(option);
        }
    }

    const storedLists = JSON.parse(localStorage.getItem('lists'));
    if (storedLists) {
        lists = storedLists;
        updateListSelect();
        if (listSelect.options.length > 0) {
            loadList(listSelect.options[0].textContent);
        }
    }

    addTaskBtn.addEventListener('click', () => {
        const description = taskInput.value.trim();
        if (description && currentList) {
            currentList.tasks.push({ description, completed: false });
            saveLists();
            renderTasks();
            taskInput.value = '';
        }
    });

    clearAllBtn.addEventListener('click', () => {
        if (currentList) {
            currentList.tasks = [];
            saveLists();
            renderTasks();
        }
    });

    toggleAllBtn.addEventListener('click', () => {
        if (currentList) {
            currentList.tasks.forEach(task => {
                task.completed = true;
            });
            saveLists();
            renderTasks();
        }
    });

    listSelect.addEventListener('change', () => {
        const selectedListName = listSelect.value;
        loadList(selectedListName);
    });

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

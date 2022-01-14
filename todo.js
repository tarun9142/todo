    let tasks = [];
    
    // fetching all reqired elements from the DOM
    const tasksList = document.getElementById('list');
    const addTaskInput = document.getElementById('add');
    const tasksCounter = document.getElementById('tasks-counter');

    // fetching tasks from the local storage

    function fetchTasks(){
        tasks = JSON.parse(localStorage.getItem("tasks"));
        if (tasks == null) {
            tasks = [];
        }
        renderList();
    }

    // creating individual list item dynamically
    
    function addTaskToDOM(task) {
        const li = document.createElement('li');
        li.innerHTML = `
        <input type="checkbox" id="${task.id}" ${task.completed ? 'checked' : ''} data-id="${task.id}" class="custom-checkbox">
        <label for="${task.id}">${task.title}</label>
        <img src="./assets/images/delete.jpg" class="delete" data-id="${task.id}" alt="delete" />
    `;

        tasksList.append(li);
    }

    // rendering tasks in the browser

    function renderList() {
        tasksList.innerHTML = '';

        for (let i = 0; i < tasks.length; i++) {
            addTaskToDOM(tasks[i]);
        }

        tasksCounter.innerHTML = tasks.length;
    }

    // for checking and unchecking individual task

    function toggleTask(taskId) {
        const task = tasks.filter(task => task.id == taskId);
        if (task.length > 0) {
            const currentTask = task[0];

            currentTask.completed = !currentTask.completed;
            renderList();
            updateStorage(); 
        }
    }

    // for checking all tasks 

    function completeAll(status){
            const newTasks = 
            tasks.map(
                (task)=> {
                    task.completed=status;
                    return task;
                });
            tasks=newTasks;
            renderList();
            updateStorage();
            if(status)
            showNotification('Hurray! all tasks completed');

    }

    // for deleting individual task

    function deleteTask(taskId) {
        const newTasks = tasks.filter(task => task.id != taskId);
        tasks = newTasks;
        renderList();
        updateStorage();
    }

    // to delete all completed tasks

    function deleteCompleted(){
            const newTasks = tasks.filter(task=> task.completed == false);
            tasks = newTasks;
            renderList();
            updateStorage();
            showNotification('All completed tasks deleted successfully');
    }

    // adding a new task to tasks list

    function addTask(task) {
        if (task) {
            tasks.push(task);
            renderList();
            updateStorage();
            return;
        }


        showNotification('task cannot be added');

    }

    // for displaying an alert

    function showNotification(text) {
        alert(text);
    }

    // to update the local storage everytime tasks array

    function updateStorage(){
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }


    // for storing the value from the input

    function handleInputKeypress(e) {
        if (e.key == 'Enter') {
            const text = e.target.value;

            if (!text) {
                showNotification('task text cannot be empty');
                return;
            }

            const task = {
                title: text,
                id: Date.now(),
                completed: false
            }

            e.target.value = '';
            addTask(task);
        }
    }

    // to handle every desired click event

    function handleClickListener(e) {
        const target = e.target;
        if (target.className == 'delete') {
            const taskId = target.dataset.id;
            deleteTask(taskId);
            return;

        } else if(target.className== 'delete-completed' || target.className== 'delete-completed-label' ||target.className== 'delete-completed-img'){
            if(tasks==''){
                showNotification('Tasks list Empty!!!')
                return;
            }
            deleteCompleted();
            document.getElementById('complete-all').checked=false;
            return;

        } else if (target.className == 'custom-checkbox') {
            const taskId = target.dataset.id;
            toggleTask(taskId);
            return;
        }else if(target.classList[0] == 'complete-all'){
            if(tasks==''){
                showNotification('Tasks list Empty');
                target.checked=false;
                return;
            }
            completeAll(target.checked);
            return;
        }
    }

    function initializeApp() {
        fetchTasks();
        addTaskInput.addEventListener('keyup', handleInputKeypress);
        document.addEventListener('click', handleClickListener);
    }

    initializeApp();

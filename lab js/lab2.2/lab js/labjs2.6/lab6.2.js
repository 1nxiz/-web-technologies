const createTodo = (text) => ({
    id: generateId(),
    text,
    completed: false,
    createdDate: new Date(),
    updatedDate: new Date()
});

const generateId = () => Math.random().toString(36).substr(2, 9);

const addTodo = (todos, text) => [...todos, createTodo(text)];

const removeTodo = (todos, id) => todos.filter(todo => todo.id !== id);

const toggleTodo = (todos, id) => 
    todos.map(todo => 
        todo.id === id 
            ? { ...todo, completed: !todo.completed, updatedDate: new Date() } 
            : todo
    );

const updateTodoText = (todos, id, text) => 
    todos.map(todo => 
        todo.id === id 
            ? { ...todo, text, updatedDate: new Date() } 
            : todo
    );

const filterTodos = (todos, filter) => {
    switch(filter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
};

const sortTodos = (todos, sortBy) => {
    const sortedTodos = [...todos];
    switch(sortBy) {
        case 'createdDate':
            return sortedTodos.sort((a, b) => b.createdDate - a.createdDate);
        case 'updatedDate':
            return sortedTodos.sort((a, b) => b.updatedDate - a.updatedDate);
        case 'status':
            return sortedTodos.sort((a, b) => a.completed - b.completed);
        default:
            return sortedTodos;
    }
};

const renderTodo = (todo) => {
    const todoItem = document.createElement('li');
    todoItem.classList.add('todo-item');
    todoItem.dataset.id = todo.id;
    
    if (todo.completed) {
        todoItem.classList.add('completed');
    }
    
    const todoContent = document.createElement('div');
    todoContent.classList.add('todo-content');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('todo-checkbox');
    checkbox.checked = todo.completed;
    
    const todoText = document.createElement('span');
    todoText.classList.add('todo-text');
    todoText.textContent = todo.text;
    todoText.addEventListener('dblclick', () => startEditing(todo.id));
    
    const todoDate = document.createElement('span');
    todoDate.classList.add('todo-date');
    todoDate.textContent = formatDate(todo.createdDate);
    
    todoContent.appendChild(checkbox);
    todoContent.appendChild(todoText);
    todoContent.appendChild(todoDate);
    
    const todoActions = document.createElement('div');
    todoActions.classList.add('todo-actions');
    
    const editButton = document.createElement('button');
    editButton.classList.add('action-btn', 'edit');
    editButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg>';
    editButton.setAttribute('title', 'Редагувати');
    
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('action-btn', 'delete');
    deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';
    deleteButton.setAttribute('title', 'Видалити');
    
    todoActions.appendChild(editButton);
    todoActions.appendChild(deleteButton);
    
    todoItem.appendChild(todoContent);
    todoItem.appendChild(todoActions);
    
    return todoItem;
};

const renderTodoList = () => {
    const todoList = document.getElementById('todo-list');
    const currentFilter = document.querySelector('.filter-btn[data-filter].active').dataset.filter;
    const currentSort = document.querySelector('.filter-btn[data-sort].active').dataset.sort;
    
    todoList.innerHTML = '';
    
    const filteredTodos = filterTodos(state.todos, currentFilter);
    const sortedTodos = sortTodos(filteredTodos, currentSort);
    
    sortedTodos.forEach(todo => {
        const todoItem = renderTodo(todo);
        todoList.appendChild(todoItem);
    });
};

const startEditing = (id) => {
    const todoItem = document.querySelector(`.todo-item[data-id="${id}"]`);
    const todoText = todoItem.querySelector('.todo-text');
    const todoContent = todoItem.querySelector('.todo-content');
    
    const currentText = todoText.textContent;
    todoContent.removeChild(todoText);
    
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.classList.add('todo-edit-input');
    editInput.value = currentText;
    editInput.setAttribute('required', '');
    editInput.setAttribute('minlength', '3');
    editInput.setAttribute('maxlength', '100');
    
    todoContent.insertBefore(editInput, todoContent.querySelector('.todo-date'));
    editInput.focus();
    
    const finishEditing = () => {
        const newText = editInput.value.trim();
        if (newText && newText !== currentText) {
            updateTodoHandler(id, newText);
        }
        
        todoContent.removeChild(editInput);
        todoContent.insertBefore(todoText, todoContent.querySelector('.todo-date'));
    };
    
    editInput.addEventListener('blur', finishEditing);
    editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            finishEditing();
        } else if (e.key === 'Escape') {
            todoContent.removeChild(editInput);
            todoContent.insertBefore(todoText, todoContent.querySelector('.todo-date'));
        }
    });
};

const formatDate = (date) => {
    const options = { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return new Date(date).toLocaleString('uk-UA', options);
};

const showSnackbar = (message) => {
    const snackbar = document.getElementById('snackbar');
    snackbar.textContent = message;
    snackbar.classList.add('show');
    
    setTimeout(() => {
        snackbar.classList.remove('show');
    }, 3000);
};

const submitHandler = (e) => {
    e.preventDefault();
    const todoInput = document.getElementById('todo-input');
    const text = todoInput.value.trim();
    
    if (text) {
        state.todos = addTodo(state.todos, text);
        todoInput.value = '';
        renderTodoList();
        showSnackbar('Завдання додано');
    } else {
        todoInput.classList.add('shake');
        setTimeout(() => todoInput.classList.remove('shake'), 500);
    }
};

const toggleTodoHandler = (id) => {
    state.todos = toggleTodo(state.todos, id);
    renderTodoList();
};

const updateTodoHandler = (id, text) => {
    state.todos = updateTodoText(state.todos, id, text);
    renderTodoList();
    showSnackbar('Завдання оновлено');
};

const deleteTodoHandler = (id) => {
    const confirmModal = document.getElementById('confirm-modal');
    const confirmBtn = document.getElementById('confirm-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const closeBtn = document.querySelector('.modal-close');
    
    const confirmDelete = () => {
        state.todos = removeTodo(state.todos, id);
        renderTodoList();
        confirmModal.style.display = 'none';
        showSnackbar('Завдання видалено');
        
        confirmBtn.removeEventListener('click', confirmDelete);
        cancelBtn.removeEventListener('click', cancelDelete);
        closeBtn.removeEventListener('click', cancelDelete);
    };
    
    const cancelDelete = () => {
        confirmModal.style.display = 'none';
        
        confirmBtn.removeEventListener('click', confirmDelete);
        cancelBtn.removeEventListener('click', cancelDelete);
        closeBtn.removeEventListener('click', cancelDelete);
    };
    
    confirmBtn.addEventListener('click', confirmDelete);
    cancelBtn.addEventListener('click', cancelDelete);
    closeBtn.addEventListener('click', cancelDelete);
    
    confirmModal.style.display = 'block';
};

const filterClickHandler = (e) => {
    if (e.target.classList.contains('filter-btn')) {
        const filterButtons = document.querySelectorAll(`.filter-btn[data-${e.target.hasAttribute('data-filter') ? 'filter' : 'sort'}]`);
        filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        renderTodoList();
    }
};

const todoListClickHandler = (e) => {
    const todoItem = e.target.closest('.todo-item');
    if (!todoItem) return;
    
    const id = todoItem.dataset.id;
    
    if (e.target.classList.contains('todo-checkbox')) {
        toggleTodoHandler(id);
    } else if (e.target.closest('.action-btn.edit')) {
        startEditing(id);
    } else if (e.target.closest('.action-btn.delete')) {
        deleteTodoHandler(id);
    }
};

const state = {
    todos: [],
};

const init = () => {
    document.getElementById('todo-form').addEventListener('submit', submitHandler);
    document.getElementById('todo-list').addEventListener('click', todoListClickHandler);
    
    const filterGroups = document.querySelectorAll('.filter-group');
    filterGroups.forEach(group => {
        group.addEventListener('click', filterClickHandler);
    });
    
    renderTodoList();
};

document.addEventListener('DOMContentLoaded', init);
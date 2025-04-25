document.addEventListener('DOMContentLoaded', function() {
    updateTaskCounts();
});


function allowDrop(event) {
    event.preventDefault();
    
    event.currentTarget.classList.add('drag-over');
}


function drag(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    
    event.target.classList.add('dragging');
    
    event.target.addEventListener('dragend', function() {
        this.classList.remove('dragging');
        
        document.querySelectorAll('.tasks-container').forEach(container => {
            container.classList.remove('drag-over');
        });
    }, { once: true }); 
}


function drop(event) {
    event.preventDefault();
    
    event.currentTarget.classList.remove('drag-over');
    
    const taskId = event.dataTransfer.getData('text/plain');
    const taskElement = document.getElementById(taskId);
    
    if (!taskElement || event.currentTarget.contains(taskElement)) {
        return;
    }
    
    const priority = getPriorityValue(taskElement);
    let inserted = false;
    
    const tasksInColumn = Array.from(event.currentTarget.querySelectorAll('.task'));
    
    for (let i = 0; i < tasksInColumn.length; i++) {
        const currentPriority = getPriorityValue(tasksInColumn[i]);
        
        if (priority > currentPriority) {
            event.currentTarget.insertBefore(taskElement, tasksInColumn[i]);
            inserted = true;
            break;
        }
    }
    
    if (!inserted) {
        event.currentTarget.appendChild(taskElement);
    }
    
    taskElement.style.animation = 'fadeIn 0.3s';
    setTimeout(() => {
        taskElement.style.animation = '';
    }, 300);
    
    updateTaskCounts();
}


function getPriorityValue(taskElement) {
    const priorityElement = taskElement.querySelector('.priority');
    
    if (priorityElement.classList.contains('high')) {
        return 3;
    } else if (priorityElement.classList.contains('medium')) {
        return 2;
    } else {
        return 1;
    }
}

function updateTaskCounts() {
    const todoCount = document.getElementById('todo').querySelectorAll('.task').length;
    document.getElementById('todo-count').textContent = todoCount;
    
    const inProgressCount = document.getElementById('in-progress').querySelectorAll('.task').length;
    document.getElementById('in-progress-count').textContent = inProgressCount;
    
    const doneCount = document.getElementById('done').querySelectorAll('.task').length;
    document.getElementById('done-count').textContent = doneCount;
}
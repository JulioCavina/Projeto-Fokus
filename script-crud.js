const formButton = document.querySelector('.app__button--add-task');
const formBar = document.querySelector('.app__form-add-task');
const textArea = document.querySelector('.app__form-textarea');
const deleteButton = document.querySelector('.app__form-footer__button--delete');
const cancelButton = document.querySelector('.app__form-footer__button--cancel');
const ulTaskList = document.querySelector('.app__section-task-list');
const ongoingTaskDescription = document.querySelector('.app__section-active-task-description');
const butnRemoveCompleteTasks = document.querySelector('#btn-remover-concluidas');
const butnRemoveAllTasks = document.querySelector('#btn-remover-todas');

let newTaskText = null;
let liSelectedTask = null;

let tarefasArray = JSON.parse(localStorage.getItem('tarefas')) || [];

function updateTask(){
    localStorage.setItem('tarefas', JSON.stringify(tarefasArray));
}

function createElementTask (tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');
    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `;
    const paragraph = document.createElement('p');
    paragraph.classList.add('app__section-task-list-item-description');
    paragraph.textContent = tarefa.descricao;

    const button = document.createElement('button');
    button.classList.add('app_button-edit');
    const buttonImage = document.createElement('img');
    buttonImage.setAttribute('src', './imagens/edit.png');
    button.append(buttonImage);

    button.onclick = () => {
        const newTaskDescription = prompt('Qual será a nova tarefa????');
        if(newTaskDescription){
            paragraph.textContent = newTaskDescription;
            tarefa.descricao = newTaskDescription;
            updateTask();
        }
    };

    li.append(svg);
    li.append(paragraph);
    li.append(button);

    if (tarefa.completa){
        li.classList.add('app__section-task-list-item-complete');
        button.setAttribute('disabled','disabled');
    } else {
        li.onclick = () => {
            if(li.classList.contains('app__section-task-list-item-active')){
                li.classList.remove('app__section-task-list-item-active');
                ongoingTaskDescription.textContent = null;
                liSelectedTask = null;
            } else {
                untoggleOngoingTaskActive();
                ongoingTaskDescription.textContent = tarefa.descricao;
                liSelectedTask = li;
                li.classList.add('app__section-task-list-item-active');
            }
        };
    }

    return li;
}

function untoggleOngoingTaskActive(){
    const taskList = document.querySelectorAll('.app__section-task-list-item');
    taskList.forEach(task => task.classList.remove('app__section-task-list-item-active'));
}

formButton.addEventListener('click', () => {
    toggleFormBar();
});

formBar.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const tarefa = { descricao: textArea.value, completa: false };
    tarefasArray.push(tarefa);
    updateTask();
    createTask(tarefa);
    deleteFormBar();
    toggleFormBar();
});

deleteButton.addEventListener('click', () => {
    deleteFormBar();
});

cancelButton.addEventListener('click', () => {
    cancelFormBar();
});

function toggleFormBar(){
    formBar.classList.toggle('hidden');
}

function deleteFormBar(){
    textArea.value = '';
}

function cancelFormBar(){
    deleteFormBar();
    toggleFormBar();
    newTaskText = null;
}

function createTask(tarefa){
    const taskElement = createElementTask(tarefa);
    ulTaskList.append(taskElement);
}

tarefasArray.forEach(tarefa => {
    const taskElement = createElementTask(tarefa);
    ulTaskList.append(taskElement);
});

document.addEventListener('focoFinalizado', () => {
    if(liSelectedTask){
        const taskIndex = Array.from(ulTaskList.children).indexOf(liSelectedTask);
        liSelectedTask.classList.remove('app__section-task-list-item-active');
        liSelectedTask.classList.add('app__section-task-list-item-complete');
        liSelectedTask.querySelector('button').setAttribute('disabled','disabled');
        ongoingTaskDescription.textContent = null;
        tarefasArray[taskIndex].completa = true;
        updateTask();
        console.log('Tarefa concluída:', tarefasArray[taskIndex]);
    }
});

butnRemoveCompleteTasks.onclick = ()=>{
    document.querySelectorAll('.app__section-task-list-item-complete').forEach(sujeito =>{
        sujeito.remove();
    })
    tarefasArray = tarefasArray.filter(tarefa => !tarefa.completa);
    updateTask();

}

butnRemoveAllTasks.onclick = ()=>{
    document.querySelectorAll('.app__section-task-list-item').forEach(sujeito =>{
        sujeito.remove();

    })
    tarefasArray = [];
    updateTask();    

}
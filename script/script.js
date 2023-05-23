const addnewlistinput = document.querySelector("[data-add-new-list-input]");
const addnewlistbutton = document.querySelector("[data-add-new-list-button]");
const listcontainer = document.querySelector("[data-list-container]");

const addnewtaskinput = document.querySelector("[data-add-new-task-input]");
const addnewtaskbutton = document.querySelector("[data-add-new-task-button]")
const taskcontainer = document.querySelector("[data-task-container]");

let lists = localStorage.getItem('list.key');
lists = lists ? JSON.parse(lists): [];
let selected_list_id;
let selected_task_id;

addnewlistbutton.addEventListener('click',AddList);
addnewtaskbutton.addEventListener('click',Addtask)
listcontainer.addEventListener('click', e => {
    if(e.target.classList.contains('list-delete')){
        const selected_list_id_to_remove = e.target.parentNode.getAttribute('data-id');
        lists = lists.filter( list => list.id != selected_list_id_to_remove);
        if(e.target.parentNode.getAttribute('data-id') == selected_list_id){
            selected_list_id = null;
        }
        SaveAndRender();
    }
    else if(e.target.classList.contains('list')){
        if(e.target.classList.contains('list-selected')){
            selected_list_id = null;
        } else {
        selected_list_id = e.target.getAttribute('data-id');
        }
        SaveAndRender();
    }
})
taskcontainer.addEventListener('click', e => {
    if(e.target.classList.contains('checkboxes')){
        selected_task_id = e.target.parentNode.parentNode.getAttribute('data-id');
        let selected_task = getSelectedTaskObj(selected_task_id);
        selected_task.completed = !selected_task.completed;
        SaveAndRender();
    }
    else if(e.target.classList.contains('task-delete')){
        const selected_task_id_to_remove = e.target.parentNode.parentNode.getAttribute('data-id');
        selected_list = getSelectedListObj();
        selected_list.tasks = selected_list.tasks.filter( task => task.id != selected_task_id_to_remove);
        SaveAndRender();
    } else if(e.target.classList.contains('task-edit')){
        const selected_task_id_to_edit = e.target.parentNode.parentNode.getAttribute('data-id');

        const this_task_element = e.target.parentNode.parentNode;
        const this_task_first_child = this_task_element.querySelector('div:first-child')
        const this_task_name_input = this_task_first_child.querySelector('input');

        selected_task = getSelectedTaskObj(selected_task_id_to_edit);

        if(e.target.textContent == "edit"){
            e.target.textContent = "save";
            this_task_name_input.removeAttribute('disabled');

        } else if(e.target.textContent == "save"){
            selected_task.name = this_task_name_input.value;
            e.target.textContent = "edit";
        }
    }
})

function renderlist(){
    listcontainer.textContent = "";
    if(lists.length == 0){
        listcontainer.textContent = "Lists is Empty :(";
        listcontainer.classList.add('empty');
    } else {
        if(listcontainer.classList.contains('empty')){
            listcontainer.classList.remove('empty');
        }
        lists.forEach(list => {
            const render_list = document.createElement('div');
            render_list.classList.add('list');

            const render_p = document.createElement('p');
            render_p.classList.add('list-name');

            const render_span = document.createElement('span');
            render_span.textContent = list.name;

            const render_list_remove = document.createElement('span');
            render_list_remove.classList.add('list-delete');
            render_list_remove.classList.add('material-symbols-outlined');
            render_list_remove.textContent = "delete";

            render_p.appendChild(render_span);
            render_list.appendChild(render_p);
            render_list.appendChild(render_list_remove);

            if(list.id == selected_list_id){
                render_list.classList.add('list-selected');
            }
            render_list.dataset.id = list.id;
            listcontainer.appendChild(render_list);
        }
    )}
}
function save(){
    localStorage.setItem('list.key',JSON.stringify(lists));
}
function SaveAndRender(){
    save();
    renderlist();
    rendertask();
}
function AddList(){
    if(addnewlistinput.value === ""){
        alert("Please Fill Correctly..");
        return;
    } else {
    const newlist = {}
    newlist.id = new Date().getTime();
    newlist.name = addnewlistinput.value;
    newlist.tasks = [];
    lists.unshift(newlist);
    addnewlistinput.value = "";
    }
    SaveAndRender();
}
function getSelectedListObj(){
    return lists.find(list => list.id == selected_list_id);
}
function getSelectedTaskObj(task_id){
    if(selected_list_id == null || task_id == null){
        return;
    } else {
        const curr_list_obj = getSelectedListObj();
        return curr_list_obj.tasks.find(task => task.id == task_id);
    }
}
function rendertask(){
    taskcontainer.textContent = "";
    if(selected_list_id != null){
        if(taskcontainer.classList.contains('empty')){
            taskcontainer.classList.remove('empty');
        }
        const selected_list_tasks = getSelectedListObj().tasks;
        if(selected_list_tasks.length == 0){
            taskcontainer.classList.add('empty');
            taskcontainer.textContent = "There are no task..";
            return;
        }
        selected_list_tasks.forEach( task => {

            const render_task = document.createElement('div');
            render_task.classList.add('task');
            render_task.dataset.id = task.id;
            if(task.completed){
                render_task.classList.add('task-checked');
            }
            const render_task_header = document.createElement('div');
            render_task_header.classList.add('task-header');
            
            const render_task_action = document.createElement('div');
            render_task_action.classList.add('task-action');

            const render_task_checkboxes = document.createElement('span');
            render_task_checkboxes.classList.add('checkboxes');
            render_task_checkboxes.classList.add('material-symbols-outlined');
            if(task.completed){
                render_task_checkboxes.textContent = "radio_button_checked";
            } else if(!task.completed){
                render_task_checkboxes.textContent = "radio_button_unchecked";
            }
        
            const render_task_name = document.createElement('input');
            render_task_name.setAttribute('type','text');
            render_task_name.setAttribute('disabled',true);
            render_task_name.value = task.name;

            const render_task_edit = document.createElement('span');
            render_task_edit.classList.add('task-edit');
            render_task_edit.classList.add('material-symbols-outlined');
            render_task_edit.textContent = 'edit';

            const render_task_delete = document.createElement('span');
            render_task_delete.classList.add('material-symbols-outlined');
            render_task_delete.classList.add('task-delete');
            render_task_delete.textContent = "delete";

            render_task_header.appendChild(render_task_checkboxes);
            render_task_header.appendChild(render_task_name);
            render_task_action.appendChild(render_task_edit);
            render_task_action.appendChild(render_task_delete);
            render_task.appendChild(render_task_header);
            render_task.appendChild(render_task_action);

            taskcontainer.appendChild(render_task);
        })
    } else {
        taskcontainer.classList.add('empty');
        taskcontainer.textContent = "Select a list..";
        return;
    }
}
function Addtask(){
    if(selected_list_id == null){
        alert("Please Select a list..");
        return;
    } else if(addnewtaskinput.value === ""){
        alert("Please Fill Correctly..");
        return;
    } else {
    const selected_list_obj = getSelectedListObj();
    const newtask = {};
    newtask.id = new Date().getTime();
    newtask.name = addnewtaskinput.value;
    newtask.completed = false;
    selected_list_obj.tasks.unshift(newtask);
    addnewtaskinput.value = "";
    }
    SaveAndRender();
}

renderlist();
rendertask();
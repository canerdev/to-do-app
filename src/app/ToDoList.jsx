'use client'

import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Button({value, onClick, classNames}) {
  return (
    <button className={`border-2 border-white p-2 text-white rounded-md ${classNames}`} onClick={onClick}>{value}</button>
  )
}

function ListElement({task, index, markDone, remove, handleDown, handleUp}) {
  return (
    <li className="border-white border-2 w-3/5 flex items-center mx-auto my-4 p-3 rounded-md" key={index}>
      <span className={`text-wrap truncate mr-5 flex-1 text-start ${task.isDone ? 'line-through' : ''}`}>{task.text}</span>
      <div className="flex gap-2">
        <Button classNames={`bg-green-600 hover:bg-green-800`} onClick={() => markDone(index)} value={"done"} />
        <Button classNames={`bg-red-700 hover:bg-red-800`} onClick={() => remove(index)} value={"remove"} />
        <Button value={"up"} onClick={() => handleUp(index)} />
        <Button value={"down"} onClick={() => handleDown(index)} />
      </div>
    </li>
  )
}

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [deletedTask, setDeletedTask] = useState();

  function handleInput(event) {
    setNewTask(event.target.value);
  }

  function addTask() {
    // user should not be allowed to enter an empty string
    if (newTask.trim() === "") {
      toast("please enter a valid task!");
      return;
    }

    setTasks([...tasks, {text: newTask, isDone: false}]);
    setNewTask("");
    toast("task is successfully added!");
  }

  function markDone(index) {
    tasks[index].isDone = !tasks[index].isDone;
    const markedTask = tasks.splice(index, 1);
    const updatedTasks = [...tasks, markedTask[0]];
    setTasks(updatedTasks);
  }

  function remove(index) {
    console.log(tasks[index]);
    setDeletedTask({text: tasks[index].text, isDone: tasks[index].isDone});
    tasks.splice(index, 1);
    setTasks([...tasks]);
    toast("task is successfully removed!");
  }
  
  function undo() {
    if (deletedTask.length === 0)
      return;
    
    setTasks([...tasks, {text: deletedTask.text, isDone: deletedTask.isDone}]);
    setDeletedTask();
  }

  function handleUp(index) {
    if (index <= 0)
      return;

    [tasks[index], tasks[index - 1]] = [tasks[index - 1], tasks[index]];
    setTasks([...tasks]);
  }

  function handleDown(index) {
    if (index >= tasks.length - 1)
      return;

    [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]];
    setTasks([...tasks]);
  }

  const list = tasks.map((task, index) => {
    return (  
      <ListElement task={task} index={index} markDone={markDone} remove={remove} handleDown={handleDown} handleUp={handleUp}/>
    );
  })

  return (
    <div className="text-white w-3/5 grid justify-items-stretch text-center mx-auto p-4">
      <div className="inline-block text-5xl my-2 p-2">to do app</div> 
      {/* add task */}
      <div className="w-3/5 flex justify-self-center gap-2">
        <input type="text"
               placeholder="enter a task..." 
               className="rounded-md basis-3/4 p-2 border-white border-2 text-black"
               value={newTask}
               onChange={handleInput}/>
        
        <Button classNames={`basis-1/4 bg-green-600 hover:bg-green-800`} onClick={addTask} value={"add"} />
      </div>
      <ol>
        {list}
      </ol>

      <Button classNames={`justify-self-end bg-red-700 ${!deletedTask ? 'hidden' : ''}`} value={"undo"} onClick={undo} />
      <ToastContainer />
    </div>
  );
}

export default ToDoList
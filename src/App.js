import Header from "./Components/Header";
import { useState , useEffect  } from 'react'
import AddTask from "./Components/AddTask";
import React from 'react'
import Tasks from "./Components/Tasks";


const App = () => {

  const [showAddTask, setShowAddTask] = useState(false)

  const [tasks, setTasks] = useState([])

  useEffect(() =>{
    const getTasks = async () =>{
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    
    getTasks()
  }, [])


//Fetch Tasks
const fetchTasks = async ()=>{
  const res = await fetch('http://localhost:5000/tasks')
  const data = await res.json()

  return data
} 


//Fetch Task -- Single Task
const fetchTask = async (id)=>{
  const res = await fetch(`http://localhost:5000/tasks/${id}`)
  const data = await res.json()

  return data
} 



//Add Task
const addTask = async (task) => {
  const res = await fetch('http://localhost:5000/tasks',{
    method: 'POST',
    headers:{
      'Content-type': 'application/json'
    },
    body: JSON.stringify(task)
  })

  const data =await res.json()
  setTasks([...tasks, data])
  

  //For Static
  // //Randmom Id 
  // const id = Math.floor(Math.random() * 10000) + 1
  // const newTask = { id, ...task}
  // //To update
  // setTasks([...tasks, newTask])
  
}


//Delete Task
const deleteTask = async (id) =>{
  //If using server
    await fetch(`http://localhost:5000/tasks/${id}`, {method: 'DELETE'})
  //Dont use above line if you just want it static 

  setTasks(tasks.filter((task) => task.id !==id))
}

//Toggle Reminder
const toggleReminder =async (id) => {
  const taskToToggle = await fetchTask(id)
  const updateTask = {...taskToToggle,
    reminder: !taskToToggle.reminder }

  const res = await fetch(`http://localhost:5000/tasks/${id}`,{
    method: 'PUT',
    headers:{
      'COntent-type': 'application/json'
    },
    body:JSON.stringify(updateTask)
  })

  const data = await res.json()

  setTasks(
    tasks.map((task) =>
     task.id === id ? { ...task, reminder:
      !task.reminder } :task) )}

  return (
    <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} 
          showAdd={showAddTask}
          />
        {showAddTask && <AddTask onAdd={addTask}/>}
        {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/> :
        'No Tasks To Show'}
    </div>
  )
}

export default App;
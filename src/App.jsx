import './App.css'
import {useState} from "react"
import { v4 as uuidv4 } from 'uuid';
import TodoList from './features/TodoList/TodoList.jsx'
import TodoForm from './features/TodoForm.jsx'

function App() {
  const [todoList, setTodoList] = useState([])

  function addTodo(title){
    const newTodo = {
       title: title,
       //id: Date.now(),
       id: uuidv4(),
       isCompleted: false
    }

    setTodoList([...todoList, newTodo])
    console.log(todoList)
  }

  function completeTodo(id){
    const updatedTodos = todoList.map((todo)=>{
      // if(todo.id===id) {
      //   return {...todo, isCompleted: true}; 
      // }
      // return todo;

      return (todo.id===id) ? {...todo, isCompleted: true} : todo ;      
               
    });
    setTodoList(updatedTodos)
  }

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todos={todoList} onCompleteTodo={completeTodo} />      
    </div>
  )
}

export default App

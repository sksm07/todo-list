import './App.css'
import {useState} from "react"
import TodoList from './TodoList.jsx'
import TodoForm from './TodoForm.jsx'

function App() {
  const [todoList, setTodoList] = useState([])

  function addTodo(title){
    const newTodo = {
       title: title,
       id: Date.now(),
       isCompleted: false
    }

    setTodoList([...todoList, newTodo])
  }

  function completeTodo(id){
    const updatedTodos = todoList.map((todo)=>{
      if(todo.id===id) {
        return {...todo, isCompleted: true}; 
      } 
         return todo;      
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

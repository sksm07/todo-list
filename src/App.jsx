import './App.css'
import {useState, useEffect} from "react"
import { v4 as uuidv4 } from 'uuid';
import TodoList from './features/TodoList/TodoList.jsx'
import TodoForm from './features/TodoForm.jsx'

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  useEffect(() => {
    const fetchTodos = async ()=> { 
      setIsLoading(true);
      const options = {
        method: "GET",
        headers: {
          "Authorization": token,
        },
      }
      try {
        const resp = await fetch(url, options)
        if(!resp.ok) {
          throw new Error(resp.message);
        }
        const response = await resp.json();
        const {records} = response;
        setTodoList(
          records.map(record => {
            const todoList = {
              id: record.id,
              ...record.fields,
            };
            if(!todoList.isCompleted){
              todoList.isCompleted = false;
            }
            return todoList;
          })
        )
      }
      catch(error) {
        setErrorMessage(error.message)
      }
      finally {
        setIsLoading(false)
      }

    };
    fetchTodos();
  }, [])


  const addTodo = async (newTodo) => {

    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted,
          }
        }
      ]
    }

    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }

    try {
      setIsSaving(true);
      const resp = await fetch(url, options);
      if(!resp.ok) {
        throw new Error("Error adding new todo...")
      }
      const {records} = await resp.json();
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      }
      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }
      setTodoList(todoList=>[...todoList, savedTodo]);
    } 
    catch(error){
      console.log(error);
      setErrorMessage(error.message)
    }
    finally{setIsSaving(false)}       

  }

  async function completeTodo(id){
    const originalTodo = todoList.find((todo) => todo.id === id);
    const updatedTodos = todoList.map((todo)=>{
        return (todo.id===id) ? {...todo, isCompleted: true} : todo ;      
               
    });
    setTodoList(updatedTodos);
    setIsSaving(true);
    const payload = {
      records: [
        {
          id: id,
          fields: {
            title: originalTodo.title,
            isCompleted: true,
          }
        }
      ]
    };

    const options = {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }

    try {
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(`Failed to complete todo: ${resp.statusText}`);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

      const revertedTodos = todoList.map((todo) =>
            todo.id === originalTodo.id ? originalTodo : todo
      );
      setTodoList(revertedTodos);

    } finally{
        setIsSaving(false);
      }

  }

  async function updateTodo(editedTodo) {

    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    const updatedTodos = todoList.map((todo) =>
        todo.id === editedTodo.id ? { ...editedTodo } : todo
    );
    setTodoList(updatedTodos);
    setIsSaving(true);
    
    const payload = {
        records: [
            {
                id: editedTodo.id,
                fields: {
                    title: editedTodo.title,
                    isCompleted: editedTodo.isCompleted,
                },
            },
        ],
    };

    
    const options = {
        method: "PATCH",
        headers: {
            Authorization: token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    };

    try {
        const resp = await fetch(url, options);
        if (!resp.ok) {
            throw new Error(`Failed to update todo: ${resp.statusText}`);
        }
        
    } catch (error) {
        console.error(error);
        setErrorMessage(`${error.message}. Reverting todo...`);
        
        const revertedTodos = todoList.map((todo) =>
            todo.id === originalTodo.id ? originalTodo : todo
        );
        setTodoList(revertedTodos);
      } finally {
        setIsSaving(false);
      }
  }

  

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
      <TodoList 
          loadingStatus={isLoading} 
          todos={todoList} 
          onCompleteTodo={completeTodo} 
          onUpdateTodo={updateTodo} 
      />
      {errorMessage && (
            <div>
              <hr></hr>
              <p>{errorMessage}</p>
              <button onClick={()=>setErrorMessage("")}>Dismiss</button>
            </div>)
      }

    </div>
  )
}

export default App

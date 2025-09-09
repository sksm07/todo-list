import './App.css'
import {useState, useEffect, useCallback} from "react"
import { v4 as uuidv4 } from 'uuid';
import TodoList from './features/TodoList/TodoList.jsx'
import TodoForm from './features/TodoForm.jsx'
import TodosViewForm  from './features/TodosViewForm.jsx';


function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [queryString, setQueryString] = useState("");

  const encodeUrl = useCallback(()=>{
    let searchQuery = "";
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    if(queryString){searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;}
    return encodeURI(`${url}?${sortQuery}&${searchQuery}`);
  },[sortField, sortDirection, queryString]);

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
        const resp = await fetch(encodeUrl(), options)
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
  }, [sortDirection,sortField,queryString])


  const addTodo = async (title) => {
    //console.log(newTodo)
    const newTodo = {title, isCompleted: false}
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
      const resp = await fetch(encodeUrl(), options);
      if(!resp.ok) {
        throw new Error("Error adding new todo...")
      }
      const {records} = await resp.json();
      console.log(records);
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
      const resp = await fetch(encodeUrl(), options);
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
        const resp = await fetch(encodeUrl(), options);
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
      <hr></hr>
      <TodosViewForm 
          sortDirection={sortDirection} 
          setSortDirection={setSortDirection}
          sortField={sortField}
          setSortField={setSortField}
          queryString={queryString}
          setQueryString={setQueryString}
      />
      {errorMessage && (
            <div>
              
              <p>{errorMessage}</p>
              <button onClick={()=>setErrorMessage("")}>Dismiss</button>
            </div>)
      }

    </div>
  )
}

export default App;

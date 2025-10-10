import './App.css'
import styles from './App.module.css'
import { Routes, Route } from "react-router";
import {useState, useEffect, useCallback, useReducer} from "react"
import { v4 as uuidv4 } from 'uuid';
import TodosPage from './pages/TodosPage.jsx';
import Header from './shared/Header.jsx';
import About from "./pages/About.jsx";
import NotFound from "./pages/NotFound.jsx";
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
  actions,
} from './reducers/todos.reducer';


function App() {
  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [queryString, setQueryString] = useState(""); 

  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

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
      dispatch({type: todoActions.fetchTodos})      
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
        dispatch({
          type: todoActions.loadTodos,
          records,
        });
      }
      catch(error) {
        dispatch({
          type: todoActions.setLoadError,
          error,
        })
      }

    };
    fetchTodos();
  }, [sortDirection,sortField,queryString])


  const addTodo = async (title) => {

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
      dispatch({type: actions.startRequest})
      const resp = await fetch(encodeUrl(), options);
      if(!resp.ok) {
        throw new Error("Error adding new todo...")
      }
      const {records} = await resp.json();
      console.log(records);
      
      dispatch({type: actions.addTodo, records});
    } 
    catch(error){
      console.log(error);
      dispatch({type: actions.setLoadError, error})
    }
    finally{
      dispatch({type: actions.endRequest})
    }       

  }

  async function completeTodo(id){
    const originalTodo = todoState.todoList.find((todo) => todo.id === id);
    dispatch({type: actions.completeTodo, id});
    dispatch({type: actions.startRequest});

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
      
      dispatch({
        type: actions.revertTodo,
        originalTodo,
        error,
      });
    } finally{
        dispatch({type: actions.endRequest});
      }

  }

  async function updateTodo(editedTodo) {

    const originalTodo = todoState.todoList.find((todo) => todo.id === editedTodo.id);
    
    dispatch({type: actions.updateTodo, editedTodo});
    dispatch({type: actions.startRequest});
    
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
        dispatch({
          type: actions.revertTodo,
          originalTodo,
          error,
        });
      } finally {
        dispatch({type: actions.endRequest});
      }
  }  
  

  return (
    <div className={styles.appContainer}>
      
      <div className={styles.appContent}>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <TodosPage
                todoState={todoState}
                addTodo={addTodo}
                updateTodo={updateTodo}
                completeTodo={completeTodo}
                sortField={sortField}
                setSortField={setSortField}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
                queryString={queryString}
                setQueryString={setQueryString}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {todoState.errorMessage && (
          <div className={styles.errorMessage}>
            <p>{todoState.errorMessage}</p>
            <button onClick={() => dispatch({ type: actions.clearError })}>
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

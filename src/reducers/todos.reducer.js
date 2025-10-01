import TodoList from "../features/TodoList/TodoList";

const initialState = {
    todoList: [],
    isLoading: false,
    isSaving: false,
    errorMessage: "",
}

const actions = {
    //actions in useEffect that loads todos
    fetchTodos: 'fetchTodos',
    loadTodos: 'loadTodos',
    //found in useEffect and addTodo to handle failed requests
    setLoadError: 'setLoadError',
    //actions found in addTodo
    startRequest: 'startRequest',
    addTodo: 'addTodo',
    endRequest: 'endRequest',
    //found in helper functions 
    updateTodo: 'updateTodo',
    completeTodo: 'completeTodo',
    //reverts todos when requests fail
    revertTodo: 'revertTodo',
    //action on Dismiss Error button
    clearError: 'clearError',
};

function reducer(state=initialState, action){
    switch(action.type) {
        case actions.fetchTodos:
            return {
                ...state,
                isLoading: true,
            }

        case actions.loadTodos:
            return {
                ...state,
                todoList: action.records.map(record => {
                            const todoList = {
                              id: record.id,
                              ...record.fields,
                            };
                            if(!todoList.isCompleted){
                              todoList.isCompleted = false;
                            }
                            return todoList;
                          }),
                isLoading: false,
            }

        case actions.setLoadError:
            return {
                ...state,
                errorMessage: action.error.message,
                isLoading: false,
            }

        case actions.startRequest:
            return {
                ...state,
                isSaving: true,
            }

        case actions.addTodo: {
            const savedTodo = {
                id: action.records[0].id,
                ...action.records[0].fields,
            }
            if (!action.records[0].fields.isCompleted) {
            savedTodo.isCompleted = false;
            }
            return {
                ...state,
                todoList: [...state.todoList, savedTodo],
                isSaving: false,
            }
        }
        
        case actions.endRequest:
            return {
                ...state,
                isLoading: false,
                isSaving: false,
            }

        case actions.revertTodo:{
          const revertedTodos = state.todoList.map((todo) =>
            todo.id === action.originalTodo.id ? action.originalTodo : todo
          );

          return {
            ...state,
            todoList: revertedTodos,
            errorMessage: action.error ? action.error.message : state.errorMessage,
            };
        }

        case actions.updateTodo: {
            const updatedTodos = state.todoList.map((todo) =>
                  todo.id === action.editedTodo.id ? { ...action.editedTodo } : todo
                );

            const updatedState = {
                ...state,
                todoList: updatedTodos,
            }

            if (action.error) {
                updatedState.errorMessage = action.error.message;
            }
            return updatedState;
        }

        case actions.completeTodo: {
            const originalTodo = state.todoList.find(
                (todo) => todo.id === action.id);

            const updatedTodos = state.todoList.map((todo)=>{
               return (todo.id===action.id) ? {...todo, isCompleted: true} : todo ;      
               
            });
            return {
                ...state,
                todoList: updatedTodos,
            };
        }
        
            
        case actions.clearError:
            return {
                ...state,
                errorMessage: "",
            }
        default:
            return state;
    }
}

export {initialState, actions, reducer};
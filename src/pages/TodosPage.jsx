import React from "react";
import TodoList from '../features/TodoList/TodoList.jsx'
import TodoForm from '../features/TodoForm.jsx'
import TodosViewForm  from '../features/TodosViewForm.jsx';

function TodosPage({
    todoState,
    addTodo,
    updateTodo,
    completeTodo,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    queryString,
    setQueryString,
}) {
     
    const filteredTodoList = todoState.todoList.filter((todo) => 
        todo.title.toLowerCase().includes(queryString.toLowerCase())
    );

    return (
        <div>
            <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />
            <TodoList 
                loadingStatus={todoState.isLoading} 
                todos={todoState.todoList} 
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
            
        </div>
    )
}

export default TodosPage;
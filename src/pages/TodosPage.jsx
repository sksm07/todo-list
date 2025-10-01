import React, {useEffect} from "react";
import TodoList from '../features/TodoList/TodoList.jsx'
import TodoForm from '../features/TodoForm.jsx'
import TodosViewForm  from '../features/TodosViewForm.jsx';
import { useSearchParams, useNavigate } from 'react-router';
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
     const [searchParams, setSearchParams] = useSearchParams();
     const navigate = useNavigate();

     const itemsPerPage = 15;
     const currentPage = parseInt(searchParams.get("page") || "1", 10);
     const filteredTodoList = todoState.todoList.filter((todo) => 
        todo.title.toLowerCase().includes(queryString.toLowerCase())
     );

    const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
    const indexOfLastTodo = indexOfFirstTodo + itemsPerPage;
    const currentTodos = filteredTodoList.slice(indexOfFirstTodo, indexOfLastTodo);

    const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage);

    useEffect(() => {
      if (totalPages > 0) {
        if (isNaN(currentPage) || currentPage < 1 ||currentPage > totalPages) {
            navigate("/"); 
        } }
    }, [currentPage, totalPages, navigate]);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
          setSearchParams({ page: (currentPage - 1).toString() });
        }
    };

    const handleNextPage = () => {
       if (currentPage < totalPages) {
          setSearchParams({ page: (currentPage + 1).toString() });
        }
    };

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
            <div
                className="paginationControls"
                style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
                marginTop: "1rem"
                }}
            >
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                  Previous
                </button>

                <span>
                  Page {currentPage} of {totalPages || 1}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                > Next
                </button>
            </div>
        </div>
    )
}

export default TodosPage;
import styles from './TodoList.module.css'
import TodoListItem from "./TodoListItem"
import { useEffect } from "react";
import { useSearchParams, useNavigate} from 'react-router';

function TodoList({loadingStatus, todos, onCompleteTodo, onUpdateTodo}) {
   const [searchParams, setSearchParams] = useSearchParams();
   const navigate = useNavigate();

   const filteredTodoList = todos.filter(todo=> !todo.isCompleted);

   const itemsPerPage = 15;
   const currentPage = parseInt(searchParams.get("page") || "1", 10);
   const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage);

   const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
   const indexOfLastTodo = indexOfFirstTodo + itemsPerPage;
   const currentTodos = filteredTodoList.slice(indexOfFirstTodo, indexOfLastTodo);


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

   if (loadingStatus) return <p>Todo list loading...</p>;

  if (filteredTodoList.length === 0) return <p>Add todo above to get started</p>;

  return (
    <>
      <ul className={styles.todoList}>
        {currentTodos.map((todo) => (
          <TodoListItem
            key={todo.id}
            todo={todo}
            onCompleteTodo={onCompleteTodo}
            onUpdateTodo={onUpdateTodo}
          />
        ))}
      </ul>

      
      {totalPages > 1 && (
        <div
          className={styles.paginationControls}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            marginTop: "1rem",
          }}
         >
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
    
   
}

export default TodoList
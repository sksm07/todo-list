import styles from './TodoListItem.module.css';
import {useEffect, useState} from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";

function TodoListItem({todo, onCompleteTodo, onUpdateTodo}){

    const [isEditing, setIsEditing] = useState(false);
    const [workingTitle, setWorkingTitle] = useState(todo.title);

    useEffect(() => {
        setWorkingTitle(todo.title);
    }, [todo]);

    const handleCancel = ()=>{
        setWorkingTitle(todo.title)
        setIsEditing(false)
    }
    
    const handleEdit = (event)=>{
        setWorkingTitle(event.target.value)
    }

    const handleUpdate = (event)=> {
        if(!isEditing){
            return;
        }
        event.preventDefault();
        onUpdateTodo({...todo, title: workingTitle});
        setIsEditing(false)
    }

    return (
        <li className={styles.todoListItem}>
            <form onSubmit={handleUpdate}>
                {isEditing ? (
                    <>
                    <TextInputWithLabel elementId={todo.title} labelText="" value={workingTitle} onChange={handleEdit} />
                    <button type="button" onClick={handleCancel}>Cancel</button>
                    <button type="button" onClick={handleUpdate}>Update</button>
                    </>
                ) : (
                    <>
                        <label>
                            <input 
                                type="checkbox" 
                                id={`checkbox${todo.id}`}
                                checked={todo.isCompleted} 
                                onChange={()=> onCompleteTodo(todo.id)} 
                            />
                        </label>
                        <span onClick={()=>setIsEditing(true)}>{todo.title}</span>
                    </>
                 )

                }              
                
            </form>
        </li>
    )
}
export default TodoListItem;
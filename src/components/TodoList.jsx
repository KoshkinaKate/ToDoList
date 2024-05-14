import React, { useReducer, useState } from 'react';
import { todoData } from './Data'

// manages the state of the todo list based on different action types
const todoReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [action.payload, ...state];
        case 'DELETE_TODO':
            return state.filter(todo => todo.id !== action.payload);
        case 'EDIT_TODO':
            return state.map(todo => 
                todo.id === action.payload.id 
                    ? { ...todo, title: action.payload.title } 
                    : todo
            );
        case 'TOGGLE_COMPLETE': //Toggles the completed status of a todo item with the specified id
            return state.map(todo => 
                todo.id === action.payload 
                    ? { ...todo, completed: !todo.completed } 
                    : todo
            );
        default:
            return state;
    }
};

const TodoList = () => {
    const [todos, dispatch] = useReducer(todoReducer, todoData); //initial state
    const [newTodo, setNewTodo] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [visibleCount, setVisibleCount] = useState(5); // state to keep track of visible items

    const handleAddTodo = () => {
        if (newTodo.trim() === "") return;
        const newTodoItem = {
            userId: 1,
            id: todos.length ? todos[0].id + 1 : 1,
            title: newTodo,
            completed: false
        };
        dispatch({ type: 'ADD_TODO', payload: newTodoItem });
        setNewTodo("");
    };

    const handleDeleteTodo = (id) => {
        dispatch({ type: 'DELETE_TODO', payload: id });
    };

    const handleEditTodo = (id) => {
        setEditingId(id);
        const todo = todos.find(todo => todo.id === id);
        setEditingText(todo.title);
    };

    const handleSaveEdit = (id) => {
        dispatch({ type: 'EDIT_TODO', payload: { id, title: editingText } });
        setEditingId(null);
        setEditingText("");
    };

    const toggleComplete = (id) => {
        dispatch({ type: 'TOGGLE_COMPLETE', payload: id });
    };

    const handleSeeMore = () => {
        setVisibleCount(prevCount => prevCount + 1); // increment the visible count by 1
    };

    return (
        <div className='main'>
            <div className='title'>
            <h1>Today's Plan</h1>
            </div>
            <div className="input">
            <input 
                type="text" 
                value={newTodo} 
                onChange={(e) => setNewTodo(e.target.value)} 
                placeholder="Add new todo" 
            />
            
            <button onClick={handleAddTodo}>Add</button>
            </div>
            <ul>
                {todos.slice(0, visibleCount).map(todo => (
                    <li key={todo.id}>
                        <input 
                            type="checkbox" 
                            checked={todo.completed} 
                            onChange={() => toggleComplete(todo.id)} 
                        />
                        {editingId === todo.id ? (
                            <input 
                                type="text" 
                                value={editingText} 
                                onChange={(e) => setEditingText(e.target.value)} 
                            />
                        ) : (
                            <span>{todo.title}</span>
                        )}
                        {editingId === todo.id ? (
                            <button onClick={() => handleSaveEdit(todo.id)}>Save</button>
                        ) : (
                            <>
                                <button onClick={() => handleEditTodo(todo.id)}>Edit</button>
                                <button 
                                    onClick={() => handleDeleteTodo(todo.id)} 
                                    disabled={!todo.completed}
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
            {visibleCount < todos.length && (
                <button onClick={handleSeeMore}>See More</button>
            )}
        </div>
    );
};

export default TodoList;

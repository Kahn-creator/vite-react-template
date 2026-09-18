import { FormEvent, useEffect, useState } from "react";
import "./App.css";

type Todo = { id: string; text: string; completed: boolean };
const STORAGE_KEY = "todo-list-items";

function loadTodos(): Todo[] {
	try { const saved = localStorage.getItem(STORAGE_KEY); return saved ? JSON.parse(saved) as Todo[] : []; } catch { return []; }
}

function App() {
	const [todos, setTodos] = useState<Todo[]>(loadTodos);
	const [draft, setDraft] = useState("");
	useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)); }, [todos]);
	const remaining = todos.filter((todo) => !todo.completed).length;
	function addTodo(event: FormEvent<HTMLFormElement>) {
		event.preventDefault(); const text = draft.trim(); if (!text) return;
		setTodos((items) => [{ id: crypto.randomUUID(), text, completed: false }, ...items]); setDraft("");
	}
	return <main className="todo-app"><section className="todo-card" aria-labelledby="todo-title">
		<div className="heading"><p className="eyebrow">MY DAILY LIST</p><h1 id="todo-title">오늘의 할 일</h1><p className="remaining" aria-live="polite">남은 할 일 <strong>{remaining}</strong>개</p></div>
		<form className="add-form" onSubmit={addTodo}><label className="sr-only" htmlFor="new-todo">새 할 일</label><input id="new-todo" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="무엇을 해야 하나요?" autoComplete="off"/><button type="submit">추가</button></form>
		{todos.length === 0 ? <p className="empty">첫 번째 할 일을 추가해 보세요.</p> : <ul className="todo-list">{todos.map((todo) => <li className={todo.completed ? "completed" : ""} key={todo.id}><label><input type="checkbox" checked={todo.completed} onChange={() => setTodos((items) => items.map((item) => item.id === todo.id ? { ...item, completed: !item.completed } : item))}/><span>{todo.text}</span></label><button className="delete" type="button" onClick={() => setTodos((items) => items.filter((item) => item.id !== todo.id))} aria-label={`${todo.text} 삭제`}>삭제</button></li>)}</ul>}
	</section></main>;
}

export default App;

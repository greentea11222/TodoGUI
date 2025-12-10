import { useEffect, useState} from "react";

function App(){
	const [todos, setTodos] = useState([]);

	//初回だけ実行される
	useEffect(() => {
		fetch("http://localhost:8080/api/todos")
			.then((res) => res.json())
			.then((data) => setTodos(data))
			.catch((err) => console.error("API取得失敗:", err));
	}, []);
	
	return (
		<div style={{ padding: "20px"}}>
			<h1>Todoリスト</h1>
			<ul>
				{todos.map((todo) => (
					<li key={todo.id}>
						{todo.title}(優先度: {todo.priority} / 完了: {todo.done ? "済" : "未"})
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
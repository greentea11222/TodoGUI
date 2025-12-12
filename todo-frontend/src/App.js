//Hooks（画面の状態を管理するReactの仕組み）をインポート
import { useEffect, useState} from "react";

function App(){
	//Reactの状態変数
	const [todos, setTodos] = useState([]);
	const [title, setTitle] = useState("");

	//useEffect：画面が初めて表示された時に一度だけ実行される処理
	useEffect(() => {
		//fetch：バックエンド（Spring Boot）へのアクセス
		//メソッドを指定しない場合はデフォルトでGETメソッド
		//TodoController.javaの@GetMapping getTodos()に繋がる
		fetch("http://localhost:8080/api/todos")
			//レスポンスの中から、res.json()でJSONを取り出してJavaScriptで扱える形に変換
			//成功したらthenに進む
			.then((res) => res.json())
			//res.json()で返ってきたデータを、Reactの状態todosにセット
			.then((data) => setTodos(data))
			//通信に失敗した時の処理
			.catch((err) => console.error("API取得失敗:", err));
	}, []);
	
	//Todoの追加
	const addTodo = () => {
		const newTodo = {
			title: title,
			done: false,
			priority: 1
		};
	
	//POSTメソッド
	fetch("http://localhost:8080/api/todos",{
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify(newTodo)
	})
		.then((res) => res.json())
		.then((created) => {
			setTodos([...todos, created]);
			setTitle("");
		});
	};
	
	//画面表示。todosの配列の中身を1つずつ<li>に変換
	return (
		<div style={{ padding: "20px"}}>
			<h1>Todoリスト</h1>
			
			<input
				value={title}
				onChanger={(e) => setTitle(e.target.value)}
				placeholder="タイトル"
			/>
			<button onClick={addTodo}>追加</button>
			
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
//Appコンポーネントを外部から利用できるようにする
export default App;
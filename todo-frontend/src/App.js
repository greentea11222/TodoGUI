//Hooks（画面の状態を管理するReactの仕組み）をインポート
//useEffect：画面が初めて表示された時に一度だけ実行される処理
//useState：データ保存のための道具
import { useEffect, useState} from "react";

function App(){
	//todosというデータを、初期値は空の配列[]として作成。
	//setTodosはtodosを更新するための関数
	const [todos, setTodos] = useState([]);
	const [title, setTitle] = useState("");
	
	//優先度を日本語にする
	const getPriorityName = (priority) => {
		switch (priority){
			case 1:
				return "高";
			case 2:
				return "中";
			case 3:
				return "低";
			default:
				return "未設定";
		}
	}
	
	//初回のみ実行
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
			priority: 2
		};
		//POSTメソッド
		fetch("http://localhost:8080/api/todos",{
			method: "POST",
			//送るデータはJSONであることを宣言
			headers: {"Content-Type": "application/json"},
			//newTodoをJSONに変換
			body: JSON.stringify(newTodo)
		})
			.then((res) => res.json())
			.then((created) => {
				//todosの末尾に新しいTodoを加えた配列を保存
				setTodos(prevTodos => [...prevTodos, created]);
				//最後に入力欄を空にする
				setTitle("");
			});
	};
		
	//Todoのdoneを更新
	const toggleDone = (id, done) => {
		const targetTodo = todos.find(todo => todo.id === id);
		
		if(!targetTodo){
			console.error("更新対象のTodoが見つかりません：", id);
			return;
		}
		const updatedTodo = {
			...targetTodo,
			done: done
		}
		
		//${id}を使う場合は`(バッククォート、Shift + @）で囲む
		fetch(`http://localhost:8080/api/todos/${id}`, {
			method: "PUT",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(updatedTodo)
		})
			.then((res) => res.json())
			.then((updated) => {
				setTodos(
					todos.map((todo) =>
						todo.id === id ? updated : todo
				)
				);
			})
			.catch((err) => console.error("更新失敗", err));
	};
	
	//画面表示。todosの配列の中身を1つずつ<li>に変換
	return (
		<div style={{ padding: "20px"}}>
			<h1>Todoリスト</h1>
			
			<input
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="タイトル"
			/>
			<button onClick={addTodo}>追加</button>
			
			<ul style={{ listStyle: "none", padding: 0}}>
				{todos.map((todo) => (
					<li 
						key={todo.id}
						style={{
							display: "flex",
							alignItems: "center",
							gap: "10px",
							padding: "8px 0",
							borderBottom: "1px solid #ddd"
						}}
					>
						<input
							type="checkbox"
							checked={todo.done}
							onChange={() => toggleDone(todo.id, !todo.done)}
						/>
						
						<span
							style={{
								flex: 1,
								textDecoration: todo.done ? "line-through" : "none",
								color: todo.done ? "#aaa" : "#000",
								opacity: todo.done ? 0.6 : 1
							}}
						>
							{todo.title}
						</span>
						<span style={{fontSize: "12px", color: "#555"}}>
							優先度: {getPriorityName(todo.priority)}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}
//Appコンポーネントを外部から利用できるようにする
export default App;
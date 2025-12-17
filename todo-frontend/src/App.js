//Hooks（画面の状態を管理するReactの仕組み）をインポート
//useEffect：画面が初めて表示された時に一度だけ実行される処理
//useState：データ保存のための道具
import { useEffect, useState} from "react";

function App(){
	//todosというデータを、初期値は空の配列[]として作成。
	//setTodosはtodosを更新するための関数
	const [todos, setTodos] = useState([]);
	//ユーザーが入力したタイトルを管理する。
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
		//新しいTodoオブジェクトを作成
		const newTodo = {
			title: title,
			done: false,
			priority: 2
		};
		//POSTリクエストを送信
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
	//関数toggleDoneの定義。引数としてidとdoneを受け取る
	const toggleDone = (id, done) => {
		//更新したいTodoオブジェクトを準備
		//find()は、配列の先頭から条件に当てはまる最初の要素を返す
		//配列の中の要素todoを受け取り、そのidと引数idが同じならtrue
		const targetTodo = todos.find(todo => todo.id === id);
		
		if(!targetTodo){
			console.error("更新対象のTodoが見つかりません：", id);
			return;
		}
		//変数updatedTodoの定義。
		//targetTodoのフィールド(id~doneまで)を全てコピーし、
		//doneだけ引数doneの値で上書きする
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
			//返ってきたレスポンスからJSON文字列を取り出し、JavaScriptで扱えるオブジェクトの形式に変換
			.then((res) => res.json())
			//上の行で変換したオブジェクトを引数updatedとして渡す
			.then((updated) => {
				setTodos(
					//map()：配列の要素を全てループ処理するメソッド
					todos.map((todo) =>
						//配列内の要素todoについて、idが引数idと同じなら、
						//その要素をupdated（レスポンスから返ってきたデータ）に置き換える。
						//falseの場合はそのまま
						todo.id === id ? updated : todo
				)
				);
			})
			.catch((err) => console.error("更新失敗", err));
	};
	
	//Todoを削除
	const deleteTodo = (id) => {
		fetch(`http://localhost:8080/api/todos/${id}`, {
			method: "DELETE",
		})
		.then((res) => {
			if(res.ok){
				setTodos(todos.fileter((todo) => todo.id !== id));
			}else {
				console.error("削除に失敗しました");
			}
		})
		.catch((err) => console.error("通信エラー：", err));
	};
	
	//画面表示。todosの配列の中身を1つずつ<li>に変換
	return (
		<div style={{ padding: "20px"}}>
			<h1>Todoリスト</h1>
			
			{/* Todoのタイトルを入力するテキストボックス */}
			<input
				/* inputボックスの現在の値をtitleに紐付け */
				value={title}
				/* inputボックスの内容が変更されるたびに、新しい値を取得してtitleを更新 */
				onChange={(e) => setTitle(e.target.value)}
				placeholder="タイトル"
			/>
			{/* クリックするとaddTodoを呼び出す */}
			<button onClick={addTodo}>追加</button>
			
			<ul style={{ listStyle: "none", padding: 0}}>
				{/* todosの要素を一つずつ取り出し、要素の数だけliを生成 */}
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
							//Todoのdoneがtrueの場合はチェック、falseの場合はチェックを外す
							checked={todo.done}
							//チェックボックスの状態を変えると、idとtodo.doneの逆を引数として関数を実行。
							onChange={() => toggleDone(todo.id, !todo.done)}
						/>
						
						<span
							style={{
								flex: 1,
								//done=trueの場合は打ち消し線を入れる
								textDecoration: todo.done ? "line-through" : "none",
								//done=trueの場合は文字色を薄い灰色にする
								color: todo.done ? "#aaa" : "#000",
								//done=trueの場合は文字を少し半透明にする
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
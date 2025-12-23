//Hooks（画面の状態を管理するReactの仕組み）をインポート
//useEffect：画面が初めて表示された時に一度だけ実行される処理
//useState：データ保存のための道具
import { useEffect, useState} from "react";

function App(){
	//todosというデータを、初期値は空の配列[]として作成。
	//setTodosはtodosを更新するための関数
	const [todos, setTodos] = useState([]);
	//ユーザーが入力したタイトルを管理する
	const [title, setTitle] = useState("");
	//締切の日付を管理する
	const [deadline, setDeadline] = useState("");
	
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
				//現在のtodosをprevTodosとし、その末尾に新しいTodoを加えた配列を保存
				setTodos(prevTodos => [...prevTodos, created]);
				//最後に入力欄を空にする
				setTitle("");
			});
	};
		
	//Todoのdoneを更新
	//関数toggleDoneの定義。引数としてidとdoneを受け取る
	const toggleDone = (id, done) => {
		//find()は、配列の先頭から条件に当てはまる最初の要素を返す
		//配列の中の要素todoを受け取り、そのidと引数idが同じならtargetTodoにそのtodoを入れる
		const targetTodo = todos.find(todo => todo.id === id);
		//見つからなければエラーを吐いて終了
		if(!targetTodo){
			console.error("更新対象のTodoが見つかりません：", id);
			return;
		}
		//targetTodoをコピーし、doneだけ引数doneの値で上書きする
		const updatedTodo = {...targetTodo,done: done};
		
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
		//確認ダイアログの表示
		if (window.confirm("このTodoを削除してよろしいですか？")){
			fetch(`http://localhost:8080/api/todos/${id}`, {
				method: "DELETE",
			})
			.then((res) => {
				if(res.ok){
					//todos配列から、idが指定idと合致しないものだけを残す
					//一致するものは配列から消す
					setTodos(todos.filter((todo) => todo.id !== id));
				}else {
					console.error("削除に失敗しました");
				}
			})
			.catch((err) => console.error("通信エラー：", err));
		}
	};
	
	//優先度を更新
	const updatePriority = (id, newPriority) => {
		
		//プルダウンを即座に更新
		setTodos(todos.map(todo => todo.id === id ? {...todo, priority: parseInt(newPriority)} : todo));
		//todos配列から、指定idに合致するtodoがあるか探す
		//見つかった場合はその要素、見つからなかった場合はundefinedが入る
		const targetTodo = todos.find(todo => todo.id === id);
		if (!targetTodo) return;
		
		//サーバーに送るためのデータを作成。targetTodoのpriorityだけ上書き
		//スプレッド構文：元のデータ（targetTodo）を丸ごとコピーし、一部分（priority）だけ書き換える
		const updatedTodo = {...targetTodo, priority: parseInt(newPriority)};
		
		fetch(`http://localhost:8080/api/todos/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json"},
			body: JSON.stringify(updatedTodo)
		})
		.then((res) => res.json())
		//上の行で変換したデータをupdatedとして受け取る
		.then((updated) => {
			//最新のtodosをcurrentTodosとし、その中の要素が指定idと一致したらupdatedに置き換える。
			setTodos(currentTodos =>
				currentTodos.map(todo => todo.id === id ? updated : todo));
		})
		.catch(err => console.error("優先度更新失敗", err));
	}
	
	//画面表示。todosの配列の中身を1つずつ<li>に変換
	return (
		<div style={{
			backgroundColor: "#f4f7f6", //薄いグレーの背景
			minHeight: "100vh", 
			padding: "40px 20px",
			fontFamily: "'Helvetica Neue', Arial, sans-serif"
		}}>
			<div style={{
				maxWidth: "500px",
				margin: "0 auto",
				backgroundColor: "#fff",
				padding: "30px",
				borderRadius: "12px", //角を丸くする
				boxShadow: "0 10px 25px rgba(0,0,0,0.1)" //ふわっとした影
			}}>
			
				<h1 style={{textAlign: "center", color: "#333", marginBottom: "30px"}}>
					MyTodoList
				</h1>
				
				{/* Todoのタイトルを入力するテキストボックス */}
				<div style={{display: "flex", gap: "10px", marginBottom: "30px"}}>
					<input
						/* inputボックスの現在の値をtitleに紐付け */
						value={title}
						/* inputボックスの内容が変更されるたびに、新しい値を取得してtitleを更新 */
						onChange={(e) => setTitle(e.target.value)}
						placeholder="何をしますか？"
						style={{
							flex: 1, padding: "12px", borderRadius: "8px",
							border: "1px solid #ddd", fontSize: "16px", outline: "none"
						}}
					/>
					{/* クリックするとaddTodoを呼び出す */}
					<button
						onClick={addTodo}
						style={{
							padding: "12px 20px", backgroundColor: "#007bff", color: "#fff",
							border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold"
						}}
					>
						追加
					</button>
				</div>
					<ul style={{ listStyle: "none", padding: 0}}>
						{/* todosの要素を一つずつ取り出し、要素の数だけliを生成 */}
						{todos
							.slice() //sortは元の配列を並べ替えてしまうので、コピーを作成
							//優先度が高い順（数字が小さい順）かつ未完了（done=false）が先に来るように並べ替え
							.sort((a, b) => {
								//aとbでdoneが違う場合
								if (a.done !== b.done){
									//aがtrue（bがfalse）の場合は1を返し、bが先に来る
									//aがfalse（bがtrue）の場合は-1を返し、aが先に来る
									//つまり、done=false（未完了）の方が先に来る！
									return a.done ? 1 : -1;
								}
								//aとbのdoneが同じ場合は優先度の数字順にする
								//引き算の結果がマイナス（aの方が数字が小さい）ならaが先に、
								//結果がプラス（bの方が数字が小さい）ならbが先に来る
								return a.priority - b.priority;
							})
							.map((todo) => (
								<li 
									key={todo.id}
									style={{
										display: "flex", alignItems: "center", gap: "15px",
										padding: "15px 0",borderBottom: "1px solid #eee"
									}}
								>
									<input
										type="checkbox"
										//Todoのdoneがtrueの場合はチェック、falseの場合はチェックを外す
										checked={todo.done}
										//チェックボックスの状態を変えると、idとtodo.doneの逆を引数として関数を実行。
										onChange={() => toggleDone(todo.id, !todo.done)}
										style={{ width: "20px", height: "20px", cursor: "pointer" }}
									/>
									
									<div style={{ flex: 1 }}>
										<div style={{
											//done=trueの場合は打ち消し線を入れる
											textDecoration: todo.done ? "line-through" : "none",
											//done=trueの場合は文字色を薄い灰色にする
											color: todo.done ? "#aaa" : "#333",
											fontSize: "16px", fontWeight: "500"
	//										//done=trueの場合は文字を少し半透明にする
	//										opacity: todo.done ? 0.6 : 1	
										}}>
										{todo.title}
										</div>
										<span style={{fontSize:"12px"}}>優先度：</span>
										<select
											value={todo.priority}
											onChange={(e) => updatePriority(todo.id, e.target.value)} 
											style={{
											fontSize: "12px", padding: "2px 4px", borderRadius: "4px",
											border: "1px solid #ddd",
											color: todo.priority == 1 ? "#e74c3c" : //高 ＝ 赤
													todo.priority == 2 ? "#f39c12": //中 = オレンジ
													"#27ae60",						//低 = 緑
											backgroundColor: todo.priority == 1 ? "#fdecea" :
															todo.priority == 2 ? "#fef5e7" :
															"#eafaf1",
											fontWeight: "bold", cursor: "pointer"
										}}>
											<option value ="1">高</option>
											<option value ="2">中</option>
											<option value ="3">低</option>
										</select>
										{/* 締切日を追加 */}
										<input 
											type="date"
											value={deadline}
											onChange={(e) => setDeadline(e.target.value)}
										/>
									</div>
									
									{/* onClick={delete(todo.id)}にすると、画面表示してすぐに実行してしまうのでNG */}
									<button
										onClick={() => deleteTodo(todo.id)}
										style={{
											backgroundColor: "transparent", border: "1px solid #ff4d4f",
											color: "#ff4d4f", padding: "5px 10px", borderRadius: "6px",
											cursor: "pointer", fontSize: "12px"
										}}
									>
										削除
									</button>
								</li>
						))}
					</ul>
					
					{/* 進捗表示 */}
					<div style={{ marginTop: "20px", textAlign: "right", fontSize: "14px", color: "#888"}}>
						{/* 配列todosの各要素（t)から、done=falseの要素だけを抽出し、要素数を数える */}
						残り：{todos.filter(t => !t.done).length} 件
					</div>
				</div>
			</div>
		);
}
//Appコンポーネントを外部から利用できるようにする
export default App;
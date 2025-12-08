package com.example.todogui.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.stereotype.Repository;

import com.example.todogui.model.Todo;

//データ管理クラスを表す
@Repository
public class TodoRepository {
	private Map<Integer, Todo> store = new HashMap<>();
	//AtomicInteger：スレッド安全なint（複数のリクエストが同時に使用しても重複しないカウンタ）
	//初期値は1
	private AtomicInteger idGenerator = new AtomicInteger(1);
	
	//storeの中の全てのTodoインスタンスをArrayListで返す
	public List<Todo> findAll(){
		//values():マップの全ての値をコレクションにして返す
		//この場合は全てのTodo
		return new ArrayList<>(store.values());
	}
	
	//新しいTodoインスタンスを生成
	public Todo save(String title) {
		//現在の値を返し、自動でインクリメントする
		int id = idGenerator.getAndIncrement();
		Todo todo = new Todo(id, title, false, 2);
		store.put(id, todo);
		return todo;
	}
	
	//idを指定して、存在すれば削除してtrue、なければfalseを返す
	public boolean delete(int id) {
		//remove(Object key)の返り値は、入っていた値（指定されたkeyがない場合はnull）
		return store.remove(id) != null;
	}
}

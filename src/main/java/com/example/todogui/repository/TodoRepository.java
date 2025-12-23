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
	public Todo save(Todo todo) {
		//現在の値を返し、自動でインクリメントする
		int id = idGenerator.getAndIncrement();
		todo.setId(id);
		store.put(id, todo);
		return todo;
	}
	
	//指定したidのTodoのdoneを変更する
	public Todo updateTodo(int id, Todo newTodo) {
		if(store.get(id) != null) {
			store.get(id).setTitle(newTodo.getTitle());
			store.get(id).setDone(newTodo.isDone());
			store.get(id).setPriority(newTodo.getPriority());
			store.get(id).setDeadline(newTodo.getDeadline());
		}
		return store.get(id);
	}
	
	//idを指定して、存在すれば削除してtrue、なければfalseを返す
	public boolean delete(int id) {
		//remove(Object key)の返り値は、入っていた値（指定されたkeyがない場合はnull）
		return store.remove(id) != null;
	}
}

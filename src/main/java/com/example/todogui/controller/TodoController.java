package com.example.todogui.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.todogui.model.Todo;
import com.example.todogui.repository.TodoRepository;

//WebAPIを返すコントローラであることを伝える。メソッドの戻り値をJSONにしたりする。
@RestController
//別ポートからのアクセスを受け入れる。React（5173番）→Spring Boot（8080番）の通信を許可
@CrossOrigin(origins = "http://localhost:5173")
//このクラスのAPIは/apiから始める。
//GET：/api/todos　POST：/api/todos　DELETE：/api/todos/{id}
@RequestMapping("/api")
public class TodoController {
	private final TodoRepository repository;
	
	public TodoController(TodoRepository repository) {
		this.repository = repository;
	}
	
	//Todo一覧をリストで返す
	@GetMapping("/todos")
	public List<Todo> getTodos(){
		return repository.findAll();
	}
	
	//Todoを作成する
	@PostMapping("/todos")
	//@RequestBody：リクエストボディ（JSON）をJavaインスタンスに変換
	//{"id":2, "title":"勉強","done":false,"priority":1}と送られてきたら、それを元にTodoインスタンスを作る
	public Todo createTodo(@RequestBody String title) {
		return repository.save(title);
	}
	
	@DeleteMapping("/todos/{id}")
	//@PathVariable：URLの{id}の部分を変数として受け取る
	public boolean deleteTodo(@PathVariable int id) {
		return repository.delete(id);
	}
}

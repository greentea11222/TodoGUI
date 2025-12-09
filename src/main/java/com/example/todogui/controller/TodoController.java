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

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class TodoController {
	private final TodoRepository repository;
	
	public TodoController(TodoRepository repository) {
		this.repository = repository;
	}
	
	//全てのTodoをリストで返す
	@GetMapping("/todos")
	public List<Todo> getTodos(){
		return repository.findAll();
	}
	
	@PostMapping("/todos")
	public Todo createTodo(@RequestBody String title) {
		return repository.save(title);
	}
	
	@DeleteMapping("/todos/{id}")
	public boolean deleteTodo(@PathVariable int id) {
		return repository.delete(id);
	}
}

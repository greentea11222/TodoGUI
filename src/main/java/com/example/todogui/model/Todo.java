package com.example.todogui.model;

import java.time.LocalDate;

//idを追加したので並べ替えのメソッドはコメントアウト。
//実装する場合はimplements　Comparable<Todo>をつける
public class Todo {
	private int id; //管理番号
	private String title; //ToDoのタイトル
	private boolean done; //完了済みかどうか
	private int priority; //優先度（1=高、2=中、3=低）
	private LocalDate deadline; //締切日。2025-12-12のような形式
	
	//コンストラクタ
	public Todo(int id, String title, boolean done, int priority) {
		this.id = id;
		this.title = title;
		this.done = done;
		this.priority = priority;
	}
	public Todo(int id, String title, boolean done) {
		//インスタンス生成時に優先度の指定がなければ「中」で作る
		this(id, title, done, 2);
	}
	public Todo(int id, String title) {
		this(id, title, false, 2);
	}
	public Todo() {
		
	}
	
	//getter
	public int getId()  {return this.id;}
	public String getTitle() {return this.title;}
	public boolean isDone() {return this.done;}
	public int getPriority() {return this.priority;}
	public LocalDate getDeadline() {return this.deadline;}
	
	//setter
	public void setId(int id) {this.id = id;}
	public void setTitle(String title) {this.title = title;}
	public void setDone(boolean done) {this.done = done;}
	public void setPriority(int priority) {this.priority = priority;}
	public void setDeadline(LocalDate deadline) {this.deadline = deadline;}
	
	@Override
	//toStringメソッド。println()の中にTodoクラスの変数を入れるだけで情報を表示してくれる
	public String toString() {
		//三項演算子（条件 ? 真のときの値 : 偽のときの値）
		//を使い、done=trueのときは[済]を、falseのときは[未]をタイトルの前につける
		String priorityName = null;
		switch (this.priority) {
		case 1 -> {priorityName = "高";}
		case 2 -> {priorityName = "中";}
		case 3 -> {priorityName = "低";}
		}
		return (this.done ? "[済]" : "[未]") + " " 
			+ this.title + "（優先度：" + priorityName + "）";
	}
}
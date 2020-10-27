import { Component, OnInit } from '@angular/core';
import { Todo } from '../../interfaces/todo';
import { trigger, transition, style, animate } from '@angular/animations';

import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/Rx';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';


@Injectable()
export class ConfigService {
  constructor(private http: HttpClient) { }
}

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Component({
  selector: 'todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  animations: [
    trigger('fade', [

      transition(':enter', [
	    style({ opacity: 0, transform: 'translateY(30px)' }),
        animate(200, style({ opacity: 1, transform: 'translateY(0px)'}))
      ]),

      transition(':leave', [
        animate(200, style({ opacity: 0, transform: 'translateY(30px)' }))
      ]),

    ])
  ]
})
export class TodoListComponent implements OnInit {
  todos: Todo[];
  listData;
  list: string;
  listArray: string[];
  todoList: string[];
  items: Todo[];
  itemOne: string;
  todoTitle: string;
  idForTodo: number;
  beforeEditCache: string;
  filter: string;
  anyRemainingModel: boolean;


  postData = {
    item: 'content',
  };
  
  j=0;
  url = 'http://localhost:8080/addtask';
  json;

  constructor(private http: HttpClient) {
    this.http.get('/list') 
      .toPromise()
      .then((data) => {
        this.listData = data;
		    this.list = JSON.stringify(this.listData);
		    this.listArray = this.list.split('item":"');
		    for (let i of this.listArray) {
		      this.listArray[this.listArray.indexOf(i)] = i.substring(0, i.indexOf('"')); 
		    }

        this.idForTodo = 2;
      })
      .catch((err) =>{
        console.log(err);
      })
  }


  totalAngularPackages;

  ngOnInit() {
    this.anyRemainingModel = true;
    this.filter = 'all';
    this.beforeEditCache = '';
    this.idForTodo = 2;
    
	  this.todos = [
      {
        'id': 1,
        'title': 'Test',
        'completed': false,
        'editing': false,
      },
    ];	
  }

  addTodo(): void {
    if (this.todoTitle.trim().length === 0) {
      return;
    }

    this.todos.push({
      id: this.idForTodo,
      title: this.todoTitle,
      completed: false,
      editing: false
    })

    this.todoTitle = '';
    this.idForTodo++;
  }


  editTodo(todo: Todo): void {
    this.beforeEditCache = todo.title;
    todo.editing = true;
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter(todo => todo.id != id);
  }

  deleteItem(title: string): void {
    this.todos = this.todos.filter(todo => todo.title !== title);
  }

  remaining(): number {
    return this.todos.filter(todo => !todo.completed).length;
  }

  atLeastOneCompleted(): boolean {
    return this.todos.filter(todo => todo.completed).length > 0;
  }

  clearCompleted(): void {
    this.todos = this.todos.filter(todo => !todo.completed);
  }

  checkAllTodos(): void {
    this.todos.forEach(todo => todo.completed = (<HTMLInputElement>event.target).checked)
    this.anyRemainingModel = this.anyRemaining();
  }

  anyRemaining(): boolean {
    return this.remaining() !== 0;
  }

  todosFiltered(): Todo[] {
    if (this.filter === 'all') {
      return this.todos;
    } else if (this.filter === 'active') {
      return this.todos.filter(todo => !todo.completed);
    } else if (this.filter === 'completed') {
      return this.todos.filter(todo => todo.completed);
    }
    return this.todos;
  }

}


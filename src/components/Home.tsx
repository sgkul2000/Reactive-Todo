import React from 'react'
import '../assets/css/todoMain.css'
import TodoItem from './TodoItem'
import Todo from '../entity/todo'
import {db} from '../firebase'
import firebase from 'firebase/app'
import 'firebase/firestore'

interface HomeState {
  todoList: Array<Todo>
  newTodo: string
  visible: boolean
}

export default class Home extends React.Component<{uid: string}, HomeState> {
  constructor(props: any) {
    super(props)
    this.state = {
      todoList: [],
      newTodo: '',
      visible: false,
    }
  }
	newTodoInput: HTMLInputElement | null = null
	wrapperRef: HTMLDivElement | null = null

  componentDidMount = async () =>  {
    try{
      let userRef = await db.collection('user').doc(this.props.uid)
      const user = await userRef.get()
      this.setState({
        todoList: user.data()?.todoList
      })
    }catch(err) {
      console.error(err)
    }
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  addTodo = async (e?: any) => {
    if (this.state.newTodo === '') {
      this.setState({
        visible: false,
      })
    } else {
      let temp = {
        done: false,
        title: this.state.newTodo
      }
      let userRef = await  db.collection('user').doc(this.props.uid)
      userRef.update({
        todoList: firebase.firestore.FieldValue.arrayUnion(temp)
    });
    
      this.setState({
        todoList: [
          ...this.state.todoList,
          temp,
        ],
        newTodo: '',
        visible: false,
      })
    }
  }
  toggleInput = () => {
    this.setState(
      {
				visible: !this.state.visible,
				newTodo: ""
      },
      () => {
        this.newTodoInput?.focus()
      }
    )
  }

  setInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      newTodo: e.target.value,
    })
	}
	
	handleClickOutside = (event:any) => {
		if (this.wrapperRef && !this.wrapperRef?.contains(event?.target)) {
			this.toggleInput()
		}
	}

	toggleDone = (index: number) => {
		let temp = this.state.todoList.slice()
    temp[index].done = !temp[index].done
    try{
    } catch(err) {
      console.error(err)
    }
		temp = temp.sort((el1, el2) => {
      return (el1.done === el2.done)? 0 : el1.done? 1 : -1;
		})
		this.setState({
			todoList: temp
		}, () => {
      try{
        db.collection("user").doc(this.props.uid).update({
          "todoList": this.state.todoList
        })
      } catch(err) {
        console.error(err)
      }
    })
	}

	deleteTask = (index: number) => {
    let temp = this.state.todoList
    temp.splice(index, 1)
		this.setState({
			todoList: temp
		}, () => {
      try{
        db.collection("user").doc(this.props.uid).update({
          "todoList": this.state.todoList
        })
      } catch(err) {
        console.error(err)
      }
    })
	}

  render() {
    return (
      <>
        <h2 id="Title">Todo</h2>
        <div className="todoWrapper">
          <ul className="todoItemList">
            {this.state.todoList.map((todo, index) => {
              return <TodoItem index={index} deleteFunc={this.deleteTask}toggleDone={this.toggleDone} key={index} item={todo} />
            })}
          </ul>
          {this.state.visible ? (
            <div className="inputWrapper" ref={(element) => {this.wrapperRef = element}}>
              <input
                ref={(input) => {
                  this.newTodoInput = input
                }}
                onChange={this.setInput}
                value={this.state.newTodo}
                type="text"
                id="newTodoInput"
              />
              <button
                className="doneBtn"
                onClick={(event: any) => this.addTodo(event)}
              >
                ✔
              </button>
            </div>
          ) : null}

          <button
            className="addBtn btn"
            onClick={(event: any) => this.toggleInput()}
          >
            Add
          </button>
        </div>
      </>
    )
  }
}

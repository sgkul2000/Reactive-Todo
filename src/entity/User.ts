import Todo from './todo'
export default interface User{
    displayName: string,
    email: string,
    id: string,
    todoList: Array<Todo>
}
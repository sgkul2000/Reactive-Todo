import React from 'react'
import Todo from '../entity/todo'

export default class TodoItem extends React.Component<{
  item: Todo
  toggleDone: Function
  index: number
  deleteFunc: Function
}> {
  wrapperRef: HTMLLIElement | null = null
  buttonRef: HTMLButtonElement | null = null

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }
  handleClickOutside = (event: any) => {
    if (this.wrapperRef && this.wrapperRef?.contains(event?.target)) {
      if (this.buttonRef && this.buttonRef?.contains(event?.target)) {
        this.props.deleteFunc(this.props.index)
      } else {
        this.props.toggleDone(this.props.index)
      }
    }
  }
  render() {
    return (
      <>
        <li
          ref={(element) => {
            this.wrapperRef = element
          }}
          key={this.props.item.toString()}
          className={`todoItem ${this.props.item.done ? 'done' : ''}`}
        >
          {' '}
          <button
            ref={(element) => {
              this.buttonRef = element
            }}
            className="deleteBtn btn"
          >
            🗑
          </button>{' '}
          {this.props.item.title}
        </li>
      </>
    )
  }
}

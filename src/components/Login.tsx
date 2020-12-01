import React from 'react'
import { auth, db } from '../firebase'
import firebase from 'firebase/app'
import 'firebase/auth'
import googleLogo from '../assets/images/google.svg'
import User from '../entity/User'

export default class Login extends React.Component<
  { loginCallback: Function },
  {}
> {
  googleLogin = () => {
    let provider = new firebase.auth.GoogleAuthProvider()
    auth
      .signInWithPopup(provider)
      .then(async (data) => {
        let userRef = db.collection('user').doc(data?.user?.uid)
        let user = await userRef.get()
        if (user.exists) {
          this.finalizeLogin(user.data())
        } else {
          await userRef.set({
            displayName: data?.user?.displayName,
            email: data?.user?.email,
            id: data?.user?.uid,
            todoList: [],
          })
          this.finalizeLogin({
            displayName: data?.user?.displayName,
            email: data?.user?.email,
            id: data?.user?.uid,
            todoList: [],
          })
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  finalizeLogin = (user: User | any) => {
    try {
      console.log(user)
      localStorage.setItem('uid', JSON.stringify(user?.id))
      localStorage.setItem('logged', true.toString())
      localStorage.setItem('user', JSON.stringify(user))
      // window.location.href = '../'
      this.props.loginCallback(user, user?.id)
    } catch (err) {
      console.error(err)
    }
    // this.setState({
    //   redirect: true
    // })
  }
  render() {
    return (
      <>
        <h1>Login</h1>
        <button className="googleBtn">
          <div className="imgWrapper">
            <img src={googleLogo} alt="" />
          </div>
          <span onClick={this.googleLogin} className="googleBtnTitle">
            Login with google
          </span>
        </button>
      </>
    )
  }
}

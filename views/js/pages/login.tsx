import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Button, Card } from 'antd'
import { Hello } from '../components/Hello'
import '../../css/pages/login.css'
import '../../css/components/Header.css';
import 'antd/dist/antd.css';
import { TestComponent } from '../components/TestComponent'
import axios from 'axios';
import { Header } from '../components/Header'

interface IProps{
  username: string
}

interface IState{

}

export class Login extends React.Component<IProps, IState> {
  constructor(props: IProps){
    super(props)
    this.state = {}
  }

   handle_login(){
    window.open('http://localhost:3000/login/authorize')
   }

  render(){
    let jsx: any =
    <div id="LoginWrapper">

      <Header isLoginPage={false} userName={"Kevin Benitez"} />
      <div id="content">

      <div id="top_text">
        What makes you favorite artists so popular?
      </div>

      <div id="bottom_text">
        Well sign in, and Ill show you.
      </div>

      </div>
     {/*
      <div id="cards">
          <Card
          hoverable
          src = '../'>
          </Card>
      </div>
*/}
      <div id="footer">
        <div id="web_info">
          Hey this is the footer
        </div>
      </div>
    </div>;
    return jsx;
  }
}


ReactDOM.render(
  <Login username='foo'/>,
  document.getElementById('root')
)

import React from 'react'
import ReactDOM from 'react-dom';

import { Container, Button, Row, Col,Form, FormGroup, Label, Input,} from 'reactstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../css/pages/index.css'

class Index extends React.Component{

  constructor(props){
    super(props);
    this.state = {}
    this.handleSubmit    = this.handleSubmit.bind(this);
  }

  handleSubmit(event){
    window.open('http://localhost:3000/login/authorize')
  }

  render(){
    return (
      <div id='wrapper'>
        <p>I am the user page</p>
        <div className={styles.header} >
          <div className='box' >
            ArtistFetch
            <Form className='login' onSubmit={this.handleSubmit}>
              <FormGroup>
                <Button className='bootstrap-button' type="primary" htmlType="submit" >Login with spotify</Button>
              </FormGroup>
            </Form>

          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Index/>, document.getElementById('root'));

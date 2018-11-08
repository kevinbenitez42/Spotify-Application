import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Button, Dropdown,Menu, Icon } from 'antd'
import '../../css/components/Header.css'
import 'antd/dist/antd.css';
import axios from 'axios'

export interface IProps{
  isLoginPage: boolean;
  userName   :    string;
  categories?:  any[];
  filters?    : any;
  updateFunction? : ((param:string) => void);
  updateByFilter? : ((param:string) => void);
  sortFunction?   : (() => void);
}

export interface IState{
}


export class Header extends React.Component<IProps, IState>{

  constructor(props : IProps){
    super(props)
    this.handle_login = this.handle_login.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
    this.selectFilter   = this.selectFilter.bind(this);
  }

  handle_login(){
    window.open('http://localhost:3000/login/authorize')
  }

  selectCategory(e : any){
    this.props.updateFunction(e['key']);
  }


  async selectFilter(e : any){
    await this.props.updateByFilter(e['key']);
    this.props.sortFunction();
  }



  render(){

    let filter_array : any[] = [];
    if(!(this.props.filters === undefined)){
      filter_array = Object.getOwnPropertyNames(this.props.filters)
    }


    return <div id="header">
    <div id="logo">
    <div id="logo-text"> ArtistFetch </div>
    </div>
    {
      /*
      is this the login page? if yes then render login Button
      else render welcome message for user
      */
      !this.props.isLoginPage ? (
      <div id="login">
      <Button style={{ background: '#FFE600', borderColor: '#FFE600'}} size='large' type='primary' block onClick={this.handle_login}>
      Login with Spotify
      </Button>
      </div>
     ) : ( <div id='user'>
      <Dropdown trigger={['click']} overlay=
      {
        this.props.categories === null ? (
          <div> Loading ... </div>
        ) : (<Menu onClick = {this.selectCategory}>{
            this.props.categories.map((category: any) => {
            return <Menu.Item key={category.id}> <a>{category.name}</a> </Menu.Item>
          })}</Menu>)
      }>

      <a className="ant-dropdown-link" href="#">
      categories <Icon type="down" /></a>
      </Dropdown>
      {/*
        
        This Dropdown component filters artists by
        Their songs qualities but getting these
        qualities for each artist takes a while
        so it may be best to get this data
        serverside or find out a more effient way
        to do the analysis

      <Dropdown trigger={['click']} overlay={
        <Menu onClick={this.selectFilter}>
        {
        filter_array.map((item) => {
          return <Menu.Item key={item}>
            <a key={item}>{item}</a>
          </Menu.Item>
        })
        }
        </Menu>
      }>
      <a className="ant-dropdown-link" href="#">
      filters <Icon type="down" /></a>
      </Dropdown>
    */}
      {!(this.props.userName === null) ? (
        <div> Hello {this.props.userName} </div>
      ): (<div> loading... </div>)}

      </div>
    )}
    </div>

  }
}

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import '../../css/components/component.css'

export interface IProps{
  index : number
}

interface IState{}

export class TestComponent extends React.Component<IProps, IState>{

  constructor(props : IProps){
    super(props)
  }

  render(){
    let jsx : any =
    <div className='TestComponent' >
      <div> { this.props.index }</div>
    </div>
    return jsx
  }
}

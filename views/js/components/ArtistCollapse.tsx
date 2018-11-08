import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Collapse, List, Card } from 'antd'
const Panel = Collapse.Panel;
import 'antd/dist/antd.css';
import axios from 'axios'

export interface IProps{
  artists: any,
  retrieveArtistInformation: (id : string) => Promise<any>;
}

export interface IState{
  activeKeys : String[],
  artistInfo : any
}


export class ArtistCollapse extends React.Component<IProps, IState>{

  constructor(props: IProps){
    super(props)
    this.activeKey = this.activeKey.bind(this);
    this.updateArtistInfo = this.updateArtistInfo.bind(this);
    this.state = {
      activeKeys : [],
      artistInfo : {}
    }
  }

  activeKey(e : any){
    if(e === undefined){ return }
    let artist_id = e;
    let activeKeys_ = this.state.activeKeys;
    for(let key of activeKeys_){
      if(artist_id === key){ return; }
    }
    activeKeys_.push(artist_id);
    this.setState({activeKeys : activeKeys_});
  }

  async updateArtistInfo(artist_id : string) : Promise<any>{
    let artistInfo = this.state.artistInfo;
    let singleArtistInfo = null;

    for(let key of Object.getOwnPropertyNames(artistInfo)){

    /*if key is found in artist info, that means data has already been loaded */
      if(key === artist_id){
        return
      }
    }

    /*if we are here, that means we havent saved an artists information */
    singleArtistInfo = await this.props.retrieveArtistInformation(artist_id);
    artistInfo[artist_id] = singleArtistInfo;
    this.setState({artistInfo: artistInfo});
  }

  getArtistInfo(artist_id : string){
    for(let key of Object.getOwnPropertyNames(this.state.artistInfo)){
      if(key === artist_id){
        return this.state.artistInfo[key]
      }
    }
    return null;
  }

  render(){
    let counter : number = 0;
    let artists: any = null;


    if(this.props.artists !== null){

      artists = this.props.artists.map((artist : any) =>{
        counter++;

        /*
        if panel is selected. key is made active, meaning data should be
        loaded into panel, otherwise no data is loaded
        */

        let activeKeys_ = this.state.activeKeys
        let shouldLoad  = false;
        for(let key of activeKeys_){
          if(key === artist.id){
            shouldLoad = true
          }
        }

        let artistInfo;

        if(shouldLoad === true){
          this.updateArtistInfo(artist.id);
          artistInfo = this.getArtistInfo(artist.id);
        }


        return <Panel
        key={artist.id}
        header={artist.name}
        style={{
          width:'1100px',
        }}
        >
        {
          shouldLoad
          ? (artistInfo === null
            ? <div> <p> Loading... </p> </div>
            : (
              <div style={{
                display: "flex",
                fontFamily: "'Cabin', sans-serif'"
              }}>
                  <div style={{
                    width :'1000px',
                    height: 'auto'
                  }}>
                  <img src={artist.images[1].url} alt={artist.id}
                   style={{
                    display:'block',
                    margin:'auto',
                    top : '100px',
                    maxWidth:'100%',
                    maxHeight:'100%'
                  }}/>
                  </div>
                  <div>
                  <List
                   grid={{gutter: 8, column: 4}}
                   dataSource={ [
                 {
                   title: 'Danceability',
                   content: artistInfo.danceability
                 },
                 {
                   title: 'Energy',
                   content: artistInfo.energy
                 },
                 {
                   title: 'Speechiness',
                   content: artistInfo.speechiness
                 },
                 {
                   title: 'Acousticness',
                   content: artistInfo.acousticness
                 },
                 {
                   title: 'Liveness',
                   content: artistInfo.liveness
                 },
                 {
                   title: 'Valence',
                   content: artistInfo.valence
                 },
                 {
                   title: 'Tempo',
                   content: artistInfo.tempo
                 },
                 {
                   title: 'Duration',
                   content: artistInfo.duration_ms
                 },
                 {
                   title: 'Popularity',
                   content: artistInfo.popularity
                 }
               ]}
                   renderItem={(item : any) => (
                     <List.Item>
                        <Card title={item.title}> {parseFloat(item.content).toFixed(2)} </Card>
                     </List.Item>
                   )}
                  />
                  </div>
              </div>
            )
          )
          : <div> <p>Im not selected</p> </div>
        }
        </Panel>
      }
    )
  }
  else{
    artists = <div> 'Loading...'</div>
  }


  return <div style={{
    display: 'flex',
    flexGrow : 1,
    flexShrink: 0,
    flexDirection: 'column'
  }}>
  <Collapse
  onChange={this.activeKey}
  accordion={true}
  style={{
    background: 'transparent',
    display:'flex',
    flexDirection:'column',
    flexGrow: 1,
    flexShrink: 0
  }}
  bordered={false} defaultActiveKey={['1']}>
  {artists}
  </Collapse>
  </div>
}
}

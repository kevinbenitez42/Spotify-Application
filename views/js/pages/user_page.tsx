import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Header } from '../components/Header'
import {ArtistCollapse} from '../components/ArtistCollapse'
import '../../css/pages/user_page.css'
import '../../css/components/Header.css'

import 'antd/dist/antd.css';

const qs = require('query-string');
var StringBuilder = require('../../../helpers/StringBuilder')
import axios from 'axios'

export interface IProps{

}

export interface IState{
  userInformation: any;
  filters        : any;
  categories     : any[];
  artists        : any[];
}

export class UserPage extends React.Component<IProps,IState>{
  constructor(props : IProps){
    super(props)
    this.getUserInformation    = this.getUserInformation.bind(this)
    this.updateByCategory      = this.updateByCategory.bind(this)
    this.getArtistsByCategory  = this.getArtistsByCategory.bind(this)
    this.updateByFilter        = this.updateByFilter.bind(this);
    this.artistAnalysis        = this.artistAnalysis.bind(this);
    this.sort                  = this.sort.bind(this)

    this.state = {
        filters: {
          'danceability': false,
          'energy': false,
          'speechiness': false,
          'acousticness': false,
          'instrumentalness': false,
          'liveness': false,
          'valence': false,
          'tempo': false,
          'duration_ms': false,
          'popularity' : false
        },
        userInformation: null,
        categories : null,
        artists    : null
      }
  }

  async retrieve_categories() : Promise<any>{
    return await axios({
      method : 'GET',
      url:     'http://localhost:3000/userPage/getCategories/none/none/US',
    })
  }

  async getUserInformation() : Promise<any> {
    return await axios({
      method: 'GET',
      url: 'http://localhost:3000/userPage/userInformation'
    })
  }


  async updateByCategory(category : string){
    let categories : any = this.state.categories
    for( let i = 0; i < this.state.categories.length; i++){
      if(categories[i].id === category){
         categories[i]['selected'] = true;
      }
      else{
        categories[i]['selected'] = false;
      }
    }
    let artists: any = await this.getArtistsByCategory();

    this.setState({
      categories : categories,
      artists    : artists
    })

  }
  async artistAnalysis(id: String) : Promise<any>{

      let query = `http://localhost:3000/userPage/artistAnalysis/none/none/${id}`;
      let artist_data = (await axios({
        method : 'GET',
        url : query
      })).data

      return new Promise<any>(resolve =>{
        resolve(artist_data)
      }
    );

  }
  async getArtistsByCategory(): Promise<any> {
    let selected_category : string = null

    for(let cat of this.state.categories){
      if(cat.selected === true){ selected_category = cat.name}
    }

    if( selected_category === null){return null;}
    /*get artists by category */
    let artists = (await axios({
      method: 'GET',
      url   : `http://localhost:3000/userPage/getArtistByCategories/${selected_category.toLowerCase()}/10/0/US`
    })).data

    var ids = [];
    for(let artist of artists){
      ids.push(artist.id)
    }

    /* now query for each artists more information about them */
    var stringBuilder = new StringBuilder()
    let query_param = stringBuilder.create_comma_seperated_query_parameter(ids)
    let query : string = `http://localhost:3000/userPage/getMultipleArtistInformation?ids=${query_param}`

    let artist_groups: any = (await axios({
      method: 'GET',
      url   : query
    })).data
    /* now that we have all artists with their respective information
       we can display basic information with accompanying images we can display relavent and when we onClick
       one of them we can load more info. for performance issues, whats returned from the
       above method is an array of array of artists(about 50 at a time), now i will
       iterate through this array and create a giant array
    */
    let final_result: any = []
    for(let artists of artist_groups){
      for(let artist of artists){
        final_result.push(artist)
      }
    }
    return final_result
  }

  async componentDidMount(){
    /*Retrieve user Information */
    let myUserInformation : any = await this.getUserInformation();
    this.setState({ userInformation : myUserInformation.data })
    /*Retrieve Possible Categories*/
    /*
      here we retrieve categories with their respective data
      Im am adding an boolean value to each category to signify
      if it has been selected by the dropdown in the header so that
      each child of the userPage that depends on a selected category
      gets updated
     */
    let categories : any =  await this.retrieve_categories();
    categories = categories.data.map((category: any) => {
      category['selected'] = false;
      return category;
    })
    this.setState({categories: categories})
  }

  async updateByFilter(filter_item : string){
    let filters = this.state.filters
    let keys = Object.getOwnPropertyNames(filters)
    for(let key of keys){
      if( key === filter_item){
        filters[key] = true;
      }
      else{
        filters[key] = false;
      }
    }
    this.setState({filters: filters})
  }

  async sort(){
    let sortedArray = null;
    let objectProperties = Object.getOwnPropertyNames(this.state.filters)
    for(let key of objectProperties){
        if(this.state.filters[key] === true){
          sortedArray = this.state.artists.sort( function(a:any, b:any){
            if( a[key] > b[key]){
              return 1;
            }
            else{
              return -1;
            }
          })
        }
    }

    sortedArray === null
    ? console.log('key not found')
    : this.setState({artists : sortedArray})
  }

  render(){
    return <div id="UserPageWrapper">

    {/*header code  that allows me to use it for login and userpage*/}

    <Header isLoginPage={true}
    /*accepts user name if user page */
    userName  ={this.state.userInformation === null
      ? null
      : this.state.userInformation.display_name
     }
    /*accepts categories used for comparison to update this parent node*/
    categories={this.state.categories === null
      ? null
      : this.state.categories
     }
     /*this function (optional) to update the user page according to dropdowns*/
     updateFunction={this.updateByCategory}
     updateByFilter={this.updateByFilter}
     sortFunction = {this.sort}
     filters={
       this.state.filters
     }
    />

    {/*content stuff, not in its own component because its only used in one place*/}

    <div id="user_page_content">
    { this.state.artists === null
    ?  'loading ...'
    :  <ArtistCollapse artists={this.state.artists} retrieveArtistInformation ={this.artistAnalysis}/>
    }
    </div>


    </div>
  }
}

ReactDOM.render(
  <UserPage/>,
  document.getElementById('root')
)

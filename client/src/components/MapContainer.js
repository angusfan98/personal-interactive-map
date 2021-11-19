import { Map, GoogleApiWrapper, Marker} from 'google-maps-react';
import React, { Component } from 'react';
import { withAuthenticationRequired, Auth0Context } from "@auth0/auth0-react";
import { Carousel, Button } from "react-bootstrap";
import background from './background.png'
import * as requests from '../utils/requests';
// import { Button } from "react-bootstrap";

import InfoWindowEx from "./InfoWindowEx";
/* global google */
const mapStyles = {
  height:'700px',
  width:'85%',
  position: 'relative',
  border: '2px solid black',
  boxShadow: '10px 10px 5px grey'
  };

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.autocompleteInput = React.createRef();
    this.autocomplete = null;
    this.handlePlaceChanged = this.handlePlaceChanged.bind(this);
    this.deleteMarkers = this.deleteMarkers.bind(this);
    this.GetInfo = this.GetInfo.bind(this);
    this.AddText = this.AddText.bind(this);
    this.RemoveText = this.RemoveText.bind(this);
    this.DeletePin = this.DeletePin.bind(this);
    this.ConfirmPin = this.ConfirmPin.bind(this);
    this.UpdatePin = this.UpdatePin.bind(this);
    this.Visited = this.Visited.bind(this);
    this.FilterVisited = this.FilterVisited.bind(this);
    this.FilterNotVisited = this.FilterNotVisited.bind(this);
    this.NoFitler = this.NoFitler.bind(this);
    this.inputRefs = [];
    this.titleRefs = [];
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.Fav = this.Fav.bind(this);
    this.EditTitle = this.EditTitle.bind(this);
    this.AddFriend = this.AddFriend.bind(this);
    this.ConvertImg = this.ConvertImg.bind(this);
    this.FetchImages = this.FetchImages.bind(this);

    this.state = {
      isMarker: false,
      lat: [],
      lng: [],
      count: 0,
      address: [],
      showingInfoWindow: [],
      activeMarker: {},
      selectedPlace: {},
      all_desc: [],
      have_visited: [],
      interested: [],
      titles: [],
      filter_visible: false,
      filter_not_visible: false,
      friendsList: [],
      images: [],
    };
  }

  static contextType = Auth0Context;
  componentDidMount() {
    var self = this;
    this.autocomplete = new google.maps.places.Autocomplete(this.autocompleteInput.current);
    this.autocomplete.addListener('place_changed', this.handlePlaceChanged);
    var pageEmail = 'email='+`${this.props.id}`;

    requests.fetchPins(pageEmail).then(function(pins) {
      if (pins.length > 0) {
        self.setState({isMarker: true})
        self.setState({count: pins.length})
      }
      for (var i = 0; i < pins.length; i++) {
        self.setState({ lat: self.state.lat.concat(pins[i]['lat'])})
        self.setState({ lng: self.state.lng.concat(pins[i]['lng'])})
        self.setState({ address: self.state.address.concat(pins[i]['address'])})
        self.setState({ all_desc: self.state.all_desc.concat(pins[i]['desc'])})
        self.setState({ have_visited: self.state.have_visited.concat(pins[i]['have_visited'])})
        self.setState({ interested: self.state.interested.concat(pins[i]['interested'])})
        self.setState({ titles: self.state.titles.concat(pins[i]['titles'])})
      }
    })
    var userEmail = 'email='+`${this.context.user.email}`;
    requests.fetchFriends(userEmail).then(function(friends) {
      // console.log(friends);
      self.setState({ friendsList: self.state.friendsList.concat(friends)});
    });

    requests.fetchImages(pageEmail).then(function(images) {
      console.log(images);
      self.setState({ images: self.state.images.concat(images)});
    });
  }
  showModal() {
    this.setState({
        show: true
    });
  }
  hideModal(){
    this.setState({
      show: false
    })
  }

  setRef = (ref) => {
    this.inputRefs.push(ref);
  }
  setRef2 = (ref) => {
    this.titleRefs.push(ref);
  }
  handlePlaceChanged(){
    const place = this.autocomplete.getPlace();
    this.AddMarker(place);
  }
  AddMarker(place){
    this.setState({isMarker: true});
    this.setState({
      lat: this.state.lat.concat(place.geometry.location.lat())
    });
    this.setState({
      lng: this.state.lng.concat(place.geometry.location.lng())
    });
    this.setState({
      address: this.state.address.concat(place.formatted_address)
    });
    this.setState({
      titles: this.state.titles.concat("No Title")
    });
    this.setState({
      all_desc: this.state.all_desc.concat("")
    });
    this.setState({ count: this.state.count + 1 });
    this.setState({
      have_visited: this.state.have_visited.concat("false")
    });
    this.setState({
      interested: this.state.interested.concat("false")
    });
    
  }

  deleteMarkers(){
    this.setState({isMarker: false});
    this.setState({lat: [] });
    this.setState({lng: [] });
    this.setState({address: [] });
    this.setState({count: 0 });
    this.setState({showingInfoWindow: [] });
    this.setState({ activeMarker: {} });
    this.setState({ selectedPlace: {} });
    this.setState({ all_desc: [] });
    this.inputRefs = [];
  }
  GetInfo(t,map,coord){
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    this.setState({isMarker: true});
    this.setState({
      lat: this.state.lat.concat(lat)
    });
    this.setState({
      lng: this.state.lng.concat(lng)
    });
    this.setState({
      address: this.state.address.concat("No address")
    });
    this.setState({
      all_desc: this.state.all_desc.concat("")
    });
    this.setState({
      titles: this.state.titles.concat("No Title")
    });
    this.setState({ count: this.state.count + 1 });
  }

  Marker_Info = (props, marker, e) =>{
    let temp = [];
    for(var i = 0; i < this.state.count; i++){
      if(i == marker.index){
        temp[i] = true;
      }
      else{
        temp[i] = false;
      }
    }
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: temp,
    });
  }
  AddText(event) {
    let temp = [];
    for(var i = 0; i < this.state.count; i++){
      if(i == event.target.value){
        temp[i] = this.inputRefs[i].value;
        this.inputRefs[i].value = null
      }
      else{
        temp[i] = this.state.all_desc[i];
      }
    }
    this.setState({ all_desc: temp});
  }
  RemoveText(event){

    let temp = [];
    for(var i = 0; i < this.state.count; i++){
      if(i == event.target.value){
        temp[i] = "";
      }
      else{
        temp[i] = this.state.all_desc[i];
      }
    }
    this.setState({all_desc: temp});
  }
  DeletePin(event) {
    var target = event.target.value; // index that we want to set null
    var userEmail = this.context.user.email;

    var new_lat = this.state.lat;
    var new_lng = this.state.lng;
    var new_address = this.state.address;
    var new_showingInfoWindow = this.state.showingInfoWindow;
    var new_desc = this.state.all_desc;
    var new_have_visited = this.state.have_visited;
    var new_interested = this.state.interested;
    var new_titles = this.state.titles;
    new_lat[target] = null;
    new_lng[target] = null;
    new_address[target] = null;
    new_showingInfoWindow[target] = null;
    new_desc[target] = null;
    new_have_visited[target] = null;
    new_interested[target] = null;
    new_titles[target] = null;
    this.setState({ lat: new_lat })
    this.setState({ lng: new_lng })
    this.setState({ address: new_address })
    this.setState({ showingInfoWindow: new_showingInfoWindow })
    this.setState({ all_desc: new_desc})
    this.setState({ have_visited: new_have_visited})
    this.setState({ interested: new_interested})
    this.setState({ titles: new_titles})
    // send POST to delete the pin from the db
    requests.deletePin(userEmail, target);
  }
  ConfirmPin(event) {
    var target = event.target.value; // index that we want to set null
    var userEmail = this.context.user.email;

    var lat = this.state.lat[target];
    var lng = this.state.lng[target];
    var address = this.state.address[target];
    var desc = this.state.all_desc[target];
    var have_visited = this.state.have_visited[target];
    var interested = this.state.interested[target];
    var titles = this.state.titles[target];
    requests.confirmPin(userEmail, lat, lng, address, desc, have_visited,interested,titles);

    window.location.reload();
  }
  UpdatePin(event) {
    var userEmail = this.context.user.email;
    var target = event.target.value; // index that we want to update
    var desc = this.state.all_desc[target];
    var have_visited = this.state.have_visited[target];
    var interested = this.state.interested[target];
    var titles = this.state.titles[target];
    requests.updatePin(userEmail, target, desc, have_visited,interested,titles);
    window.location.reload();

  }
  Visited(event){
    let temp = [];
    for(var i = 0; i < this.state.count; i++){   
      if(i == event.target.value){
        if(this.state.have_visited[i]=='true'){
          temp[i] = 'false';
        }
        else{
          temp[i] = 'true';
        }
      }
      else{
        temp[i] = this.state.have_visited[i];
      }
    }
    this.setState({ have_visited: temp });
  }
  FilterVisited(){
    this.setState({ filter_visible: true });
    this.setState({ filter_not_visible: false });
  }
  FilterNotVisited(){
    this.setState({ filter_not_visible: true });
    this.setState({ filter_visible: false });
  }
  NoFitler(){
    this.setState({ filter_not_visible: false });
    this.setState({ filter_visible: false });
  }
  Fav(event){
    let temp = [];
    for(var i = 0; i < this.state.count; i++){
      if(i == event.target.value){
        if(this.state.interested[i]=='true'){
          temp[i] = 'false';
        }
        else{
          temp[i] = 'true';
        }
      }
      else{
        temp[i] = this.state.interested[i];
      }
    }
    this.setState({ interested: temp });
  }
  EditTitle(event) {
    let temp = [];
    for(var i = 0; i < this.state.count; i++){
      if(i == event.target.value){
        temp[i] = this.titleRefs[i].value;
        this.titleRefs[i].value = null
      }
      else{
        temp[i] = this.state.titles[i];
      }
    }
    this.setState({ titles: temp});
  }
  AddFriend(event) {
    event.preventDefault();
    var userEmail = this.context.user.email;
    const {name, email } = event.target.elements;
    requests.addFriend(userEmail, name.value, email.value);
    window.location.reload();
  }
  ConvertImg(event) {
    event.preventDefault();
    var userEmail = this.context.user.email;
    const {title, caption, url } = event.target.elements;
    requests.addImage(userEmail, title.value, caption.value, url.value);
    window.location.reload(); 
  }
  FetchImages(){
    var userEmail = this.context.user.email;

  };
  render() { 
    const isMarked = this.state.isMarker;
    const counter = this.state.count;
    const green = {url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"};
    const blue = {url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"};
    const red = {url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"};
    let markers = [];
    let info_w =[];
    let l_visited = [];
    let l_WantVisited = [];
    let l_interested = [];
    let color = null;
    let vis = [];
    if(isMarked == true) {
      for(var i = 0; i < counter; i++){
        if(this.state.have_visited[i]=='true')
        {
          color = {url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"};
          l_visited[i] = <li className="list-group-item" key={i}>{this.state.titles[i]}</li>
          if(this.state.interested[i]=='true'){
            l_interested[i] = <li className="list-group-item" key={i}>{this.state.titles[i]} </li>
          }
        }else{
          color = {url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"};
          l_WantVisited[i] = <li className="list-group-item"key={i}>{this.state.titles[i]} </li>
          if(this.state.interested[i]=='true'){
            l_interested[i] = <li className="list-group-item" key={i}>{this.state.titles[i]} </li>
          }
        }
        if(this.state.filter_visible){
          if(this.state.have_visited[i] == 'true'){
            vis[i] = true;

          }
          else{
            vis[i] = false;
          }
        }
        else if(this.state.filter_not_visible){
          if(this.state.have_visited[i]== 'true'){
            vis[i] = false;
          }
          else{
            vis[i] = true;
          }
        }
        else{
          vis[i] = true;
        }
        markers[i] = <Marker
                        key={i}
                        position={{ lat: this.state.lat[i], lng: this.state.lng[i] }}
                        onClick={this.Marker_Info}
                        index = {i}
                        name={this.state.address[i]}
                        icon={color}
                        visible={vis[i]}/>

        if (this.context.user.email.replace(/[ ,.]/g, "") == this.props.id){
          var visitCheck = false;
          var interestCheck = false;
          if(this.state.have_visited[i]=='true' && this.state.interested[i] =='true'){
            info_w[i]= <InfoWindowEx
                    key={i}
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow[i]}>
                      <div>
                        <h1 id="info_box_title" >{this.state.titles[i]}</h1>
                        <p>Lattitude: {this.state.lat[i]}</p>
                        <p>Longitude: {this.state.lng[i]}</p>
                        <p>Description: {this.state.all_desc[i]}</p>
                        <input type="checkbox" id="visited" onClick={this.Visited} value={i} defaultChecked={true}/>
                        <label htmlFor="visited"> I Have Visited</label>
                        <br/>
                        <input type="checkbox" id="Interested" onClick={this.Fav} value={i} defaultChecked={true}/>
                        <label htmlFor="Interested"> Add To Most Interested</label>
                        <br/>
                        <br></br>
                        <label htmlFor="title">Title:</label>
                        <input ref={this.setRef2} id="title" />
                        <button type="button" id="addtext_button" className="btn btn-info btn-sm" onClick={this.EditTitle} value={i}>Edit Title</button>
                        <br/><br></br>
                        <label htmlFor="desc">Description:</label>
                        <input ref={this.setRef} id="desc" />
                        <button type="button" id="addtext_button" className="btn btn-info btn-sm" onClick={this.AddText} value={i}>Add/Edit Description</button>
                        <button type="button" id="removetext_button" className="btn btn-info btn-sm" onClick={this.RemoveText} value={i}>Remove Description</button>
                        <br></br><br></br><br></br>
                        <div id='add_delete_update'>
                        <button type="button" id="confirmpin_button" className="btn btn-info btn-sm" onClick={this.ConfirmPin} value={i}>Add Pin</button>
                        <button type="button" id="deletepin_button" className="btn btn-info btn-sm" onClick={this.DeletePin} value={i}>Delete Pin</button>
                        <button type="button" id="updatepin_button" className="btn btn-info btn-sm" onClick={this.UpdatePin} value={i}>Update Pin</button>
                        </div>
                      </div>
                  </InfoWindowEx>
          }//end true true
          else if(this.state.have_visited[i]=='true' && this.state.interested[i] =='false'){
            info_w[i]= <InfoWindowEx
                    key={i}
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow[i]}>
                      <div>
                        <h1 id="info_box_title" >{this.state.titles[i]}</h1>
                        <p>Lattitude: {this.state.lat[i]}</p>
                        <p>Longitude: {this.state.lng[i]}</p>
                        <p>Description: {this.state.all_desc[i]}</p>
                        <input type="checkbox" id="visited" onClick={this.Visited} value={i} defaultChecked={true}/>
                        <label htmlFor="visited"> I Have Visited</label>
                        <br/>
                        <input type="checkbox" id="Interested" onClick={this.Fav} value={i} />
                        <label htmlFor="Interested"> Add To Most Interested</label>
                        <br/>
                        <br></br>
                        <label htmlFor="title">Title:</label>
                        <input ref={this.setRef2} id="title" />
                        <button type="button" id="addtext_button" className="btn btn-info btn-sm" onClick={this.EditTitle} value={i}>Edit Title</button>
                        <br/><br></br>
                        <label htmlFor="desc">Description:</label>
                        <input ref={this.setRef} id="desc" />
                        <button type="button" id="addtext_button" className="btn btn-info btn-sm" onClick={this.AddText} value={i}>Add/Edit Description</button>
                        <button type="button" id="removetext_button" className="btn btn-info btn-sm" onClick={this.RemoveText} value={i}>Remove Description</button>
                        <br></br><br></br><br></br>
                        <div id='add_delete_update'>
                        <button type="button" id="confirmpin_button" className="btn btn-info btn-sm" onClick={this.ConfirmPin} value={i}>Add Pin</button>
                        <button type="button" id="deletepin_button" className="btn btn-info btn-sm" onClick={this.DeletePin} value={i}>Delete Pin</button>
                        <button type="button" id="updatepin_button" className="btn btn-info btn-sm" onClick={this.UpdatePin} value={i}>Update Pin</button>
                        </div>
                      </div>
                  </InfoWindowEx>
          }
          else if(this.state.have_visited[i]=='false' && this.state.interested[i] =='true'){
            info_w[i]= <InfoWindowEx
                    key={i}
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow[i]}>
                      <div>
                        <h1 id="info_box_title" >{this.state.titles[i]}</h1>
                        <p>Lattitude: {this.state.lat[i]}</p>
                        <p>Longitude: {this.state.lng[i]}</p>
                        <p>Description: {this.state.all_desc[i]}</p>
                        <input type="checkbox" id="visited" onClick={this.Visited} value={i} />
                        <label htmlFor="visited"> I Have Visited</label>
                        <br/>
                        <input type="checkbox" id="Interested" onClick={this.Fav} value={i} defaultChecked={true}/>
                        <label htmlFor="Interested"> Add To Most Interested</label>
                        <br/>
                        <br></br>
                        <label htmlFor="title">Title:</label>
                        <input ref={this.setRef2} id="title" />
                        <button type="button" id="addtext_button" className="btn btn-info btn-sm" onClick={this.EditTitle} value={i}>Edit Title</button>
                        <br/><br></br>
                        <label htmlFor="desc">Description:</label>
                        <input ref={this.setRef} id="desc" />
                        <button type="button" id="addtext_button" className="btn btn-info btn-sm" onClick={this.AddText} value={i}>Add/Edit Description</button>
                        <button type="button" id="removetext_button" className="btn btn-info btn-sm" onClick={this.RemoveText} value={i}>Remove Description</button>
                        <br></br><br></br><br></br>
                        <div id='add_delete_update'>
                        <button type="button" id="confirmpin_button" className="btn btn-info btn-sm" onClick={this.ConfirmPin} value={i}>Add Pin</button>
                        <button type="button" id="deletepin_button" className="btn btn-info btn-sm" onClick={this.DeletePin} value={i}>Delete Pin</button>
                        <button type="button" id="updatepin_button" className="btn btn-info btn-sm" onClick={this.UpdatePin} value={i}>Update Pin</button>
                        </div>
                      </div>
                  </InfoWindowEx>
          }
          else{
            info_w[i]= <InfoWindowEx
                    key={i}
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow[i]}>
                      <div>
                        <h1 id="info_box_title" >{this.state.titles[i]}</h1>
                        <p>Lattitude: {this.state.lat[i]}</p>
                        <p>Longitude: {this.state.lng[i]}</p>
                        <p>Description: {this.state.all_desc[i]}</p>
                        <input type="checkbox" id="visited" onClick={this.Visited} value={i} />
                        <label htmlFor="visited"> I Have Visited</label>
                        <br/>
                        <input type="checkbox" id="Interested" onClick={this.Fav} value={i} />
                        <label htmlFor="Interested"> Add To Most Interested</label>
                        <br/>
                        <br></br>
                        <label htmlFor="title">Title:</label>
                        <input ref={this.setRef2} id="title" />
                        <button type="button" id="addtext_button" className="btn btn-info btn-sm" onClick={this.EditTitle} value={i}>Edit Title</button>
                        <br/><br></br>
                        <label htmlFor="desc">Description:</label>
                        <input ref={this.setRef} id="desc" />
                        <button type="button" id="addtext_button" className="btn btn-info btn-sm" onClick={this.AddText} value={i}>Add/Edit Description</button>
                        <button type="button" id="removetext_button" className="btn btn-info btn-sm" onClick={this.RemoveText} value={i}>Remove Description</button>
                        <br></br><br></br><br></br>
                        <div id='add_delete_update'>
                        <button type="button" id="confirmpin_button" className="btn btn-info btn-sm" onClick={this.ConfirmPin} value={i}>Add Pin</button>
                        <button type="button" id="deletepin_button" className="btn btn-info btn-sm" onClick={this.DeletePin} value={i}>Delete Pin</button>
                        <button type="button" id="updatepin_button" className="btn btn-info btn-sm" onClick={this.UpdatePin} value={i}>Update Pin</button>
                        </div>
                      </div>
                  </InfoWindowEx>
          }
        }//end email checking
        else {
          info_w[i]= <InfoWindowEx
                    key={i}
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow[i]}>
                      <div>
                        <h1 id="info_box_title" >{this.state.selectedPlace.name}</h1>
                        <p>Lattitude: {this.state.lat[i]}</p>
                        <p>Longitude: {this.state.lng[i]}</p>
                        <p>Description: {this.state.all_desc[i]}</p>
                        </div>
                    </InfoWindowEx>
        }
      }
    }
    else{
      markers = null;
    }

    // Get the friends
    var html_friendsList = [];
    for (var i = 0; i < this.state.friendsList.length; i++) {
      var emailLink = this.state.friendsList[i].email;
      // FIXME: Update the href link
      html_friendsList[i] = <li key={i}> <a id="html_friendslist" href={'http://localhost:3000/map/'+emailLink}>{this.state.friendsList[i].name}</a> </li>
    }

    // display error page if you do not have permissions to access the page
    if (this.context.user.email.replace(/[ ,.]/g, "") != this.props.id ) {
      var found = false;
      // Check if the user is part of the friends list
      for (var i = 0; i < this.state.friendsList.length; i++) {
        if (this.state.friendsList[i].email == this.props.id) {
          // console.log("found!!!")
          found = true;
          break;
        }
      }
      // console.log(found)
      if (found == false) {
        return (
          <p>Error you dont have access to this page :)</p>
        );
      }
    }
    
    var caroList = [];
    if (this.state.images.length == 0) {
      caroList[i] =   <Carousel.Item>
                          <img
                            className="d-block w-100"
                            src="https://lh4.googleusercontent.com/mJmD6_l9xa8jvWnoFDmp1mUKcEhKzTTzG-XhtCw9UkGAwT6JaJECZN9bcg8B2PX-3l2YAvMh5QCAYu7YV6F6=w1920-h947-rw"
                            height="500px"
                          />
                          <Carousel.Caption>
                            <h3 id='upload_images_desc'>Upload Images!</h3>
                            <p id='image_desc'>Use the form below to add an image to the carousel</p>
                          </Carousel.Caption>
                        </Carousel.Item>
    }
    else {
      for (var i = 0; i < this.state.images.length; i++) {
        caroList[i] =   <Carousel.Item>
                          <img
                            className="d-block w-100"
                            src={this.state.images[i].imageString}
                            alt="First slide"
                            height="500px"
                          />
                          <Carousel.Caption>
                            <h3 id='upload_images_desc'>{this.state.images[i].title}</h3>
                            <p id='image_desc'>{this.state.images[i].caption}</p>
                          </Carousel.Caption>
                        </Carousel.Item>
      }
    }
    

    // console.log("i got here")
    return (
      // MAP STUFF
      <div style={{ backgroundImage:`url(${background})` }}>
        <div id="map">
          <Map
            onClick={this.GetInfo}
            google={this.props.google}
            zoom={10}
            style={mapStyles}
            initialCenter={{lat:49.2827, lng:-123.1207}}
          >
          {markers}
          {info_w}
          </Map>
        </div>

        {/* SIDEBAR */}
        <div>
          <nav id="sidebar">
            <div className="sidebar-header">
                <h3>Friends</h3>
            </div>
            <ul class="list-unstyled components">
                <li class="active">
                    <a id="friends_list_subtitle">Contacts</a>
                      <ul id="list_of_friends" class="friends">
                        {html_friendsList}
                      </ul>
                </li>
            </ul>
            <ul>
              <div id="friend_form">
                <form onSubmit={this.AddFriend}>
                  <a id="form_title">Add Friend: </a>
                  <label>
                    Name: <br></br>
                    <input id="add_friend_input_name" type="text" name="name" /><br></br>
                  </label> <br></br>
                  <label>
                    Email: <br></br>
                    <input id="add_friend_input_email" type="text" name="email" />  <br></br>
                  </label> <br></br>
                  <input id="submitfriendbutton" class="btn btn-secondary btn-sm" type="submit" value="Submit"/>
                </form>
              </div>
            </ul>
          </nav>
        </div>

        {/* Buttons on top of the map */}
        <div className="input-group input-group-sm mb-3" id="box">
          <input ref={this.autocompleteInput}  id="autocomplete" placeholder="Enter a location"type="text"></input>
          {/* <input className="btn btn-secondary btn-sm" id="delete_button" onClick={this.deleteMarkers} type="button" value="Delete Markers"></input> */}
          <input className="btn btn-secondary btn-sm" id="visited_button" onClick={this.FilterVisited} type="button" value="Filter by Places Visited"></input>
          <input className="btn btn-secondary btn-sm" id="not_visited_button" onClick={this.FilterNotVisited} type="button" value="Filter by Places Want To Visit"></input>
          <input className="btn btn-secondary btn-sm" id="no_filter_button"onClick={this.NoFitler} type="button" value="No Filter"></input>
        </div>

        {/* Places visited information/list */}
        <div id="placeVisited" >
          <h2 id="place_visited_title" htmlFor="myList">Places Visited</h2>
          <ul class="list-group-item list-group-item-action list-group-item-dark" id="myList" style={{listStyleType:"none"}}>
            {l_visited}
          </ul>
          <h2 id="place_visited_title_two" htmlFor="myList2">Places to Visit</h2 >
          <ul class="list-group-item list-group-item-action list-group-item-dark" id="myList2" style={{listStyleType:"none"}}>
            {l_WantVisited}
          </ul>
          <h2 id="place_visited_title_three" htmlFor="myList3">Favourite Locations</h2 >
          <ul class="list-group-item list-group-item-action list-group-item-dark" id="myList3" style={{listStyleType:"none"}}>
            {l_interested}
          </ul>
        </div>

        {/* Carousel of pictures underneath places visited */}
        <div id="carousel">
          <Carousel>
            {caroList}
          </Carousel>
          <div id="upload_img" style={{display: 'flex', justifyContent: 'center'}}>
                <form onSubmit={this.ConvertImg}>
                  <br></br>
                  <a id="form_title">Upload Images</a><br></br>
                  <div id="upload_form">
                  <label>
                    Title: <br></br>
                    <input id="title_image" type="text" name="title" /><br></br>
                  </label> <br></br>
                  <label>
                    Caption: <br></br>
                    <input id="caption" type="text" name="caption" />  <br></br>
                  </label> <br></br>
                  <label>
                  URL to Image: <br></br>
                    <input id="url" type="text" name="url" />  <br></br>
                  </label> <br></br>
                  <input class="btn btn-secondary btn-sm" type="submit" value="Submit"/>
                  </div>
                </form>
              </div>
        </div>
      </div>  // ENTIRE webpage div
    );
  }
}

export default withAuthenticationRequired(GoogleApiWrapper({
    apiKey: 'AIzaSyBZyNRrH2z2PN_r8MymD8qzXS1DfNDEhww'
})(MapContainer), {
    onRedirecting: () => (<div>Redirecting you to the login page</div>)
});

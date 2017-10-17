import React, { Component } from 'react';
import './App.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/';
import * as server from '../server/'

class EntityExtractor extends Component{

	constructor(props) {
    	super(props);
      this.handleSubmit = this.handleSubmit.bind(this)
    	this.state = {
      		text: "Please write an essay about your favorite DOM element.",
          entities: []
    	}
    }


  handleChange = (event) => {
    	this.setState({text: event.target.value})
  	}

  handleSubmit = (event) => {
    	alert('An essay was submitted: ' + this.state.text);
    	event.preventDefault();
      server.postProject("Random Title", this.state.text)
        .then((data) => {
            console.log("posted data: " + data);
        })
        .catch((error) => {
          console.log("found an error: " + error)
        })
  	}

	render() {
		return(
			<form onSubmit={this.handleSubmit}>
        		<label>
          		Name:
          			<textarea className="add-text" value={this.state.text} onChange={this.handleChange} />
        		</label>
        		<input type="submit" value="Submit" />
      		</form>
		)
	}
}


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        dispatch: dispatch,
    };
}

function mapStateToProps(state) {
    return {
        savedEntities: state.data.savedEntities,
        entityNames: state.data.entityNames
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityExtractor)
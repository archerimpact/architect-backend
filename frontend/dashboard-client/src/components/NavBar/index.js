import React, { Component } from 'react';

import './style.css'

import {Link, withRouter } from 'react-router-dom';

class NavBar extends Component {

  constructor(props) {
    super(props);
  }

	render () {
		var self = this
		const Logged = withRouter(({ history }) => (
		  <button style={{color: 'inherit'}}
		    iconButtonElement={
		      <button><div /></button>
		    }
		    targetOrigin={{horizontal: 'right', vertical: 'top'}}
		    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
		  >
		    <div primaryText="Refresh" />
		    <div primaryText="Help" />
		    <div primaryText="Sign out" 
		    	onClick={() => {				
		    	self.props.logOut()
				}}
		    />
		  </button>
		  )
		);
		const Login = withRouter(({ history }) => (
		  <button> 
		  	<Link style={{textDecoration: 'none', color: 'inherit'}} to={{
			    pathname: '/login',
			    state: { from: this.props.location }
			  }}> Login </Link>
		   </button>
		  )
		);

    return (
			<div className="outerContainer">
          <Link to="/">
            <div className="logo" />
          </Link>
          {/* <div className="searchContainer">
            <DatabaseSearchBar/>
          </div> */}
          <div className="iconMenu">
            {this.props.isAuthenticated ? <Logged logOut={this.props.logOut.bind(this)}/> : <Login logIn={this.props.logIn.bind(this)}/>}
          </div>
			</div>
		);
	};
};


class Login extends Component {

  render() {
    return (
      <button style={{color: 'inherit'}} label="Login"  onClick={() => this.props.logIn()}/>
    );
  }
}

export default NavBar;

import React, { Component } from 'react';
//import '../App.css';
import './SourcePage.css';

import AddEntity from './AddEntity.js'
import EntityList from './EntityList.js'
import NodeGraph from './NodeGraph.js'
import Source from './Source.js'

import Paper from 'material-ui/Paper';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/';
import * as server from '../../server/';


class SourcePage extends Component {
  componentWillMount = () => {
        server.loadEntities()
            .then((data) => {
                this.props.dispatch(actions.addEntities(data.entities))            
                this.props.dispatch(actions.addSources(data.documents))
        }).catch((err) => console.log(err))
    }

  render() {
    var currentSources = [this.props.savedSources.documents.find((document) => {return document._id === this.props.match.params.id})]
    if (typeof(currentSources[0]) === "undefined") {
      currentSources=[]
    }
    return (
      <div>  
        <div className="centered">
          <div id="summary">      
            <h1 id="hello"> Hong Kong Internet (Holding) Unlimited Document #1 </h1>
          </div>
          <AddEntity className="addentity"/>
        </div>
        <div className="document-entities">
          <div className="left-column">
            <Source />
          </div>
          <div className="middle-column">
            <EntityList entities={this.props.sourceEntities}/>
          </div>
          <div className="right-column">
            <Paper>
              <NodeGraph entities={this.props.sourceEntities} sources={currentSources}/>
            </Paper>
          </div>
        </div>
      </div>
    );
  }
}
 
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        dispatch: dispatch,
    };
}

function mapStateToProps(state, props) {
    var sourceid = props.match.params.id
    return {
        savedEntities: state.data.savedEntities,
        savedSources: state.data.savedSources,
        sourceEntities: state.data.savedEntities.entities.filter(function (obj) {return obj.sources[0]=== sourceid})
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SourcePage)
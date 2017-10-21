import React, { Component } from 'react';

import './App.css'

import ProjectList from './projects/projectList.js';
import EntitiesTable from './ProjectPage/EntitiesTable';
import SourcesTable from './SourcesTable';
import PDFUploader from './pdf_uploader/pdfUploader';

import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper'
import {Tabs, Tab} from 'material-ui/Tabs';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/';

import { Link } from 'react-router-dom';

class Home extends Component {
    render() {
        return (

            <div style={{height:'100%'}}>
                <div className="app">
                    <div className="summary">
                        <h1>Homepage</h1>         
                    </div>
                    <div className="the-rest" style={{width:'100%', margin:'0 auto'}}>
                        <Tabs tabItemContainerStyle={{background: '#fafafa'}}>
                            <Tab label="Projects" type="default" style={{backgroundColor: '#fafafa', color:'#747474'}}>
                            <div className="column">
                                <Paper className="projects">
                                    <ProjectList/>
                                </Paper>

                            </div>
                            </Tab>
                            <Tab label={"Entities (" + this.props.savedEntities.entities.length + ")"} style={{backgroundColor: '#fafafa', color:'#747474'}}>
                                <div className="column">
                                    <Paper className="projects">
                                        <EntitiesTable />
                                    </Paper>
                                </div>
                            </Tab>
                            <Tab label="Sources (2)" style={{backgroundColor: '#fafafa', color:'#747474'}}>
                                <div className="column">
                                    <PDFUploader />
                                    <p></p>
                                    <Paper className="projects">
                                        <SourcesTable />
                                    </Paper>
                                </div>
                            </Tab>
                        </Tabs>
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

function mapStateToProps(state) {
    return {
        savedEntities: state.data.savedEntities,
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Home);

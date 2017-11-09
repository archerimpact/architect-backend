import React, { Component } from 'react';
import EntityCard from './EntityCard';
import './style.css';
class EntitiesList extends Component {
	render() {
		return (
			<div>
				{this.props.entities.slice().reverse().map((entity, id) => {
					return (
						<div className="entityList" key={id}>
							<EntityCard onEntityClick={this.props.onEntityClick} entity={entity} getSource={this.props.getSource}/>
						</div>
					);
				})}
			</div>
		);
	}
}
export default EntitiesList
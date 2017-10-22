import React, { Component } from 'react';
import '../App.css';
import * as d3 from 'd3'

class NodeGraph extends Component {

	//takes in a list of entities and documents and maps it to a list of nodes for the d3 simulation
	createNodes(entities, documents) {
		var entityNodes = entities.map((entity) => {
			return {"id": entity.name, "name": entity.name, "type": entity.type}
		});
		var documentNodes = documents.map((documentid) => {
			return {"id": documentid, "name": documentid, "type": "DOCUMENT"}
		});
		return documentNodes.concat(entityNodes)
	};

	//iterates over all the entitiesa and documents and builds an array of all the links for the d3 simulation
	createLinks(entities, documents) {
		var documentLinks =[]
		if (documents.length >= 1) {
			documentLinks = [].concat.apply([], documents.map((documentid) => {
				return this.sourceToLinks(documentid, entities)
			}))
		} 
		var entityConnections = [].concat.apply([], entities.map((entity) => {
			return this.tagsToLinks(entity);
		}));
		return entityConnections.concat(documentLinks)
	};

	//takes all of the tags of one entity and returns an array of all the links of that one entity
	tagsToLinks(entity) {
		return entity.chips.map((chip) => {
			return {"source": entity.name, "target": chip}
		});
	};

	//TO-DO: refactor so that this method takes entities and maps a connection
	// to sources if and only if the source appears in this graph
	sourceToLinks(sourceid, entities) {
		return entities.map((entity) => {
			return {"source": entity.name, "target": sourceid};
		});
	};

	//returns the color of the node based on the type of the entity
	getNodeColor(node) {
		if (node.type === "Person" || node.type === "PERSON") {
			return "#FFB7A0"
		}
		if (node.type === "Company" || node.type === "DOCUMENT") {
			return "#3EE8D3" 
		}
		if (node.type ==="ORGANIZATION") {
			return "#FAAAFF"
		}
		if (node.type === "Location" || node.type === "LOCATION") {
			return "#5163FF"
		}
		if (node.type === "NATIONALITY") {
			return "#95FF6F"
		}
	}

	//the entire logic for generating a d3 forceSimulation graph
	generateNetworkCanvas(entities) {
		var documents = this.props.documents
		const dataNodes = this.createNodes(entities, documents)

		const linkNodes = this.createLinks(entities, documents)

		const data = {
			"nodes": dataNodes,
			"links": linkNodes
		};

		const width = 500;
		const height = 500;

		const simulation = d3.forceSimulation(data.nodes)
			.force("center", d3.forceCenter(width/3, height/2))
    		.force("charge", d3.forceManyBody())
    		.force("link", d3.forceLink().distance(100).id(function(d) { return d.id; }));

		const svg = d3.select(this.refs.mountPoint)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('display', "block")
			.attr('margin', "auto")
			.attr('id', 'svg1')

		const linkElements = svg.selectAll('line')
			.data(data.links)
			.enter()
			.append('line')
			.style('stroke', '#999999')
			.style('stroke-opacty', 0.6)
			.style('stroke-width', 2.0);


		const nodeElements = svg.selectAll('circle')
			.data(data.nodes)
			.enter()
			.append('g')
			.style('cursor', 'pointer')

		nodeElements.append('circle')
			.attr('r',7)
			.style('stroke', '#FFFFFF')
			.style('stroke-width', 1.5)
			.style('fill', (d) => this.getNodeColor(d));

		
		svg.selectAll('circle').call(d3.drag()
				.on("start", dragstarted)
				.on("drag", dragged)
				.on("end", dragended))

		nodeElements.append('text')
			.style("font-size", "12px")
			.text((d) => d.name)

		simulation.on('tick', () => {
			var movement = 0;
			linkElements
				.attr('x1', (d) => d.source.x)
				.attr('y1', (d) => d.source.y)
				.attr('x2', (d) => d.target.x)
				.attr('y2', (d) => d.target.y);
			nodeElements
				.attr('transform', (d) => {return 'translate(' + d.x + movement + ',' + d.y + movement + ')'});
		})	
		simulation.force("link").links(data.links)

		function dragstarted(d) {
			if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  				d.fx = d.x;
  				d.fy = d.y;
		}

		function dragged(d) {
			d.fx = d3.event.x;
  			d.fy = d3.event.y;
		}

		function dragended(d) {
  			if (!d3.event.active) simulation.alphaTarget(0);
  				d.fx = null;
 				d.fy = null;
		}
	}
	
	//When the props update (aka when there's a new entity or relationship), delete the old graph and create a new one
	componentWillReceiveProps(nextProps) {		
		const mountPoint = d3.select('#svgdiv')
		mountPoint.selectAll("svg").remove()
		this.generateNetworkCanvas(nextProps.entities)	
	}

	//builds the first graph based on after the component mounted and mountPoint was created.
	componentDidMount = () => {
		this.generateNetworkCanvas(this.props.entities)
	}

	render() {
		return (
			<div>
				<div id="svgdiv" ref="mountPoint" />
			</div>
		)
	}
}

export default NodeGraph
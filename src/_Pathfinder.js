import React, {Component} from 'react';
import Graph from 'graphology';
import getBounds from 'svg-path-bounds';
import dijkstra from 'graphology-shortest-path/dijkstra';

const generator = function({undirected, source, target, attributes}) {
  return source+'-'+target;
};

function edgeWeight({x:x1,y:y1},{x:x2,y:y2}){
  let a = x1 - x2;
  let b = y1 - y2;
  return Math.sqrt( a*a + b*b );
}

function createNode({
  id = '',
  d = ''
}) {
  let [left, top, right, bottom] = getBounds(d);
  let parsedId = id.split(/_|:/);
  let node = {
      id: parsedId[1],
      attributes: {
        type: parsedId[0],
        neighbors: (parsedId[2])
          ? parsedId[2].split(',')
          : null,
        bbox: {
          x: left,
          y: top,
          height: bottom - top,
          width: right - left,
          center: {
            x: left + (right - left) / 2,
            y: top + (bottom - top) / 2
          }
        }
      }
    }
  return node;
}

class Pathfinder extends Component {
  constructor(props) {
    super(props);

    const graph = new Graph({edgeKeyGenerator: generator});
    this.props.data.path.unshift({});
    let nodes = this.props.data.path.reduce((result,item) => {
      let {id,attributes} = createNode({id:item['@attributes']['id'],d:item['@attributes']['d']});
      result[id] = attributes;
      return result;
    });

    graph.addNodesFrom(nodes);
    graph.nodes().forEach((source) => {
      let sourceCenter = graph.getNodeAttribute(source,'bbox');
      if (graph.getNodeAttribute(source,'neighbors'))
      graph.getNodeAttribute(source,'neighbors').forEach((target) =>{
        if (graph.hasNode(target)) {
          let targetCenter = graph.getNodeAttribute(target,'bbox');
          graph.addUndirectedEdge(source,target,{weight:edgeWeight(sourceCenter,targetCenter)});
        }
      });
    });
    console.log(graph.nodes().join('\n'));
    const path = dijkstra.bidirectional(graph, 'obi', 'mediamarkt');
    console.log(path);
    this.state = {
      graph: graph
    };
  }
  render() {
    let graph = this.state.graph;
    return (<g id='schema'>
      <g>
        {graph.nodes().map((node) =>{
          let attributes = graph.getNodeAttributes(node);
          return <rect key={node} stroke='#000' x={attributes.bbox.x} y={attributes.bbox.y} height={attributes.bbox.height} width={attributes.bbox.width} />
        })}
      </g>
      <g>
        {graph.edges().map((edge) =>{
          let [source,target] = edge.split('-');
          let {x:x1,y:y1} = graph.getNodeAttribute(source,'bbox')['center'];
          let {x:x2,y:y2} = graph.getNodeAttribute(target,'bbox')['center'];
          return <line key={edge} stroke='#000' strokeWidth='2' x1={x1} y1={y1} x2={x2} y2={y2} />
        })}
      </g>
    </g>);
  }

}

export default Pathfinder;

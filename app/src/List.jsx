import React, { Component } from 'react';
import { get } from './api';
import './List.css';

export default class List extends Component {
  state = {
    isLoading: true,
    error: null,
    list: []
  }

  componentDidMount() {
    this.getList();
  }

  getList() {
    get("list", this.props.token, (data, message) => {
      if(data) {
        this.setState({list: data, error: null, isLoading: false});
      } else {
        this.setState({list: [], error: message, isLoading: false});
      }
    });
  }

  render() {
    return (
      <div className="ListWrapper">
        <h1>Clusters</h1>
        {this.state.error && <div className="Error">{this.state.error}</div>}
        <div className="List">
          {this.state.isLoading && <div className="Loading">Loading...</div>}
          {this.state.list.map((cluster, i) => (
            <div key={i} className="Cluster">
              <h3>Cluster {i+1}</h3>
              { cluster.map((blog, j) => (
                <div key={j}>{blog}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

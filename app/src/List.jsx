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
        <h1>List</h1>
        {this.state.error && <div className="Error">{this.state.error}</div>}
        {this.state.isLoading && <div className="Loading">...</div>}
        <div className="List">
          { this.state.list.map((item, i) => (
            <div key={item.id}>{item.name}</div>
          ))}
        </div>
      </div>
    );
  }
}

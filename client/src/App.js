import React, { Component } from 'react';
import axios from 'axios';
const Template = require('./template');

const apiURL = 'http://localhost:3001/api/'

class App extends Component {
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
  };

  // when component mounts, first thing it does is get all existing data in our db
  // then we add polling logic so that we can check if our db has changed
  // so we can add those changes into the UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever
  // always kill a process every time we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // in the frontend, we use the id key of our data object
  // to identify which we want to update or delete
  // for the backend, we use the object id from Mongo to modify
  // the db entries

  getDataFromDb = () => {
    fetch(apiURL + 'getData')
    .then((data) => data.json())
    .then((res) => this.setState({ data: res.data }));
  };

  putDataToDB = (message) => {
    let currentIds = this.state.data.map((data) => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post('http://localhost:3001/api/putData', {
      id: idToBeAdded,
      message: message,
    });
  };

  deleteFromDB = (idToDelete) => {
    parseInt(idToDelete);
    let objIdToDelete = null;
    this.state.data.forEach((dat) => {
      if (dat.id === idToDelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete('http://localhost:3001/api/deleteData', {
      data: {
        id: objIdToDelete
      },
    });
  };

  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    parseInt(idToUpdate);
    this.state.data.forEach((dat) => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post('http://localhost:3001/api/updateData', {
      id: objIdToUpdate,
      update: { message: updateToApply },
    });
  };

  // empties the database
  PurgeDB = () => {
    // TODO
  }

//   module.exports = React.createClass({
//   render: function() {
//     var bar = 'baz';
//     return(
//       <Template foo={bar}/>
//     );
//   }
// });

  render() {
    const { tempdata } = this.state;
    return (
      <Template data={tempdata}/>
    );
  }
}

export default App;

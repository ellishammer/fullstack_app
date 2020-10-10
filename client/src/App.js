import React, { Component } from 'react';
import axios from 'axios';
import bookLogo from './download.png'
import background from './background.jpg'
// const Template = require('./template');

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
purgeDB = () => {
    data = fetch(apiURL + 'getData')
    .then((data) => data.json())
    .then((res) => this.setState({ data: res.data }));

    this.state.data.forEach((dataa) => {
        if (dataa.id === idToDelete) {
            objIdToDelete = dataa._id;
        }

        axios.delete('http://localhost:3001/api/deleteData', {
            data: {
                id: objIdToDelete
            },
        });
    });
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
    const { data } = this.state;
    return (
      <div className="temp" style={{backgroundImage: `url(${background})`, display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
        <div style={{backgroundColor: '#FFFFFF', borderRadius: 20, padding: 50}}>
          <div id="header">
            <div id="imageDiv">
              <img src={bookLogo} alt="book logo" style={{height: 50, width: 50}}></img>
            </div>
            <div id="titleDiv">
              <h2>My Books</h2>
            </div>
          </div>
          <div>
            <ul>
              {data.length <= 0
                ? 'No books yet'
                : data.map((dat) => (
                    <li style={{ padding: '10px' }} key={data.message}>
                      <span style={{ color: 'gray' }}> id: </span> {dat.id} <br />
                      <span style={{ color: 'gray' }}> data: </span>
                      {dat.message}
                    </li>
                  ))}
            </ul>
          </div>
          <div style={{ padding: '10px' }}>
            <input
              type="text"
              onChange={(e) => this.setState({ message: e.target.value })}
              placeholder="add something in the database"
              style={{ width: '200px' }}
            />
            <button onClick={() => this.putDataToDB(this.state.message)}>
              Add
            </button>
          </div>
          <div style={{ padding: '10px' }}>
            <input
              type="text"
              style={{ width: '200px' }}
              onChange={(e) => this.setState({ idToDelete: e.target.value })}
              placeholder="put id of item to delete here"
            />
            <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
              Delete
            </button>
          </div>
          <div style={{ padding: '10px' }}>
            <input
              type="text"
              style={{ width: '200px' }}
              onChange={(e) => this.setState({ idToUpdate: e.target.value })}
              placeholder="id of item to update here"
            />
            <input
              type="text"
              style={{ width: '200px' }}
              onChange={(e) => this.setState({ updateToApply: e.target.value })}
              placeholder="put new value of the item here"
            />
            <button
              onClick={() =>
                this.updateDB(this.state.idToUpdate, this.state.updateToApply)
              }
            >
              Update
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

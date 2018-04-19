import React, { Component } from 'react';
import './App.css';
// BrowserRouter is the router implementation for HTML5 browsers (vs Native).
// Link is your replacement for anchor tags.
// Route is the conditionally shown component based on matching a path to a URL.
// Switch returns only the first matching route rather than all matching routes.
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';
import Profile from './components/Profile'
import Navbar from './components/Navbar'
import HomePage from './components/HomePage'

class App extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      currentUser: {}
    }
    this.handleNav = this.handleNav.bind(this);
    this.handleUpdateUser = this.handleUpdateUser.bind(this);
  }

  componentDidMount() {
    const users = [
      {
        id:"0",
        email: "billgates@email.com",
        firstName: "Bill",
        lastName: "Gates",
        jobTitle: "Co founder",
        birthday: "09/28/1955",
        password: "password123"
      },
      {
        id:"1",
        email: "johnsmith@email.com",
        firstName: "John",
        lastName: "Smith",
        jobTitle: "CEO",
        birthday: "10/11/1989",
        password: "pass456"
      },
      {
        id:"2",
        email: "muskdog@email.com",
        firstName: "Elon",
        lastName: "Musk",
        jobTitle: "Engineer",
        birthday: "06/28/1971",
        password: "pass000"
      }
    ];

    this.setState({
      users,
      currentUser: users[0]
    });
  }

  //handleNav takes to the users page you select from homepage to their profile page
  //every user has the same url ex: http://localhost:3000/profile
  handleNav(index, i) {
    this.setState((prev, props) => {
      prev.currentUser = prev.users[index];
      return prev;
    });
    i.push('/profile');
  }

  //handler for updating the user
  handleUpdateUser(data, uid, mode) {
    const index = this.state.users.findIndex(i => i.id === uid);
    if(mode === 'usr') {
      this.setState((prev, props) => {
        data.password = prev.users[index].password;
        prev.users[index] = data;
        prev.currentUser = data;
        return prev;
      });
    }
    else {
      this.setState((prev, props) => {
        prev.users[index].password = data.newPassword;
        prev.currentUser.password = data.newPassword;
        return prev;
      });
    }
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar />
          <Switch>
            <Route exact path="/" render={ props => (
              <HomePage {...props}
                users={this.state.users}
                navigate={this.handleNav}/>
            )}/>
            <Route exact path="/profile" render={ props => (
              <Profile {...props}
                user={this.state.currentUser}
                updateUser={this.handleUpdateUser} />
            )}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

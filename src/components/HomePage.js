import React from 'react';

export default function HomePage(props) {
  return (
    <div className="container home">
      <h2>Users</h2>
      <ul>
        {/* Mapping every user to display on homepage, displays first name only */}
        {props.users.map((user, i) => (
          // Navigate goes to the desired users account page
          // Key is the ID of the user
          <li onClick={()=>props.navigate(i, props.history)} key={i}>{user.firstName}</li>
        ))}
      </ul>
    </div>
  );
}

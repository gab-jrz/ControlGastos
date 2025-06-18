import React from 'react';
import NavMenu from './NavMenu';

export default function Layout({ children }) {
  return (
    <>
      <NavMenu />
      <main className="container mt-4">
        {children}
      </main>
    </>
  );
}


/*import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div>
        <NavMenu />
        <Container>
          {this.props.children}
        </Container>
      </div>
    );
  }
}*/

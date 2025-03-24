import * as React from 'react';

export default class WelcomeContent extends React.Component {

  render() {
    return (
        <div className="row justify-content-md-center">
            <div className="jumbotron jumbotron-fluid">
              <div className="container">
                <h1 className="display-4">Привет</h1>
                <p className="lead">Зарегистрируйтесь, чтобы пользоваться приложением.</p>
              </div>
            </div>
        </div>
    );
  };
}
import React from 'react'
import { hot } from 'react-hot-loader'
import PropTypes from 'prop-types'

class App extends React.Component {
    static propTypes = {
        history: PropTypes.object,
    };

    render() {

        return (
            <h1> It works </h1>
        )
    }
}

export default hot(module)(App)
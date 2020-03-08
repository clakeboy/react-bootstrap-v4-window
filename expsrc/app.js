import React from 'react';
import {render} from 'react-dom';
import routers from './routers';
import { hot } from 'react-hot-loader/root';

render(hot(routers),document.getElementById('react-main'));

if (module.hot) {
    module.hot.accept();
}

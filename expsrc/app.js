import React from 'react';
import {render} from 'react-dom';
import routers from './routers';
import { hot } from 'react-hot-loader/root';
import { i18n } from "@clake/react-bootstrap4"
i18n.setLang('en')
render(hot(routers),document.getElementById('react-main'));

if (module.hot) {
    module.hot.accept();
}

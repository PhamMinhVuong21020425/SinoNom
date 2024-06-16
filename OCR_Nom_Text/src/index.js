import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import FontStyle from './pages/ShareComponent/Font/FontStyle';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { store } from './redux';
import IntlProviderWrapper from './translations/IntlProviderWrapper';
let persistor = persistStore(store);
let language = navigator.language;
ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <IntlProviderWrapper>
                    <FontStyle>
                        <App />
                    </FontStyle>
                </IntlProviderWrapper>
            </PersistGate>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root'),
);

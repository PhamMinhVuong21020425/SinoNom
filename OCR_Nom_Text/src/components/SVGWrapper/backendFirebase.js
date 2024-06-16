import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
const firebaseConfig1 = {
    apiKey: 'AIzaSyD4GHgPMYY2znWx8S9x4P9bZOmTflMeGSk',
    authDomain: 'smartiot-7389c.firebaseapp.com',
    databaseURL: 'https://smartiot-7389c-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'smartiot-7389c',
    storageBucket: 'smartiot-7389c.appspot.com',
    messagingSenderId: '709692540344',
    appId: '1:709692540344:web:abd5d03437c5d18d7b3b4d',
    measurementId: 'G-0FW7V8CX08',
};

const backend = initializeApp(firebaseConfig1, 'backend');
export const imageDb = getDatabase(backend);

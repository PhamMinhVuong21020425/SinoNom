import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyBeiqSaab6f77vfjs85HHFB4ZCLfF_iDXA',
    authDomain: 'ocr-nom.firebaseapp.com',
    projectId: 'ocr-nom',
    storageBucket: 'ocr-nom.appspot.com',
    messagingSenderId: '93646238116',
    appId: '1:93646238116:web:359ca219f474044eba9131',
    measurementId: 'G-5GYYGK1PBT',
};

const app = initializeApp(firebaseConfig);
export const imageDb = getStorage(app);

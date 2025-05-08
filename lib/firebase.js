import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  setPersistence,
  browserSessionPersistence,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDRNpEDXFkgqJqoMrBS_2yW53UhiQojO4o",
  authDomain: "doctor-appointment-73004.firebaseapp.com",
  projectId: "doctor-appointment-73004",
  appId: "1:498826708610:web:6adae0b730c3b82b99569b",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Set session-only persistence
setPersistence(auth, browserSessionPersistence);

export { auth, provider, RecaptchaVerifier };

import firebase from "firebase/app";
import "firebase/auth";
import { useState } from "react";
import './App.css';
import firebaseConfig from "./fireBaseConfiq";

firebase.initializeApp(firebaseConfig);

function App() {
  const [user,setUser] = useState({
    isSignedIn: false,
    name :' ',
    email: ' ',
    photo:' '
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const handelSignIn=()=>{
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, photoURL,email} = res.user;
      const signedInUser ={
        isSignedIn:true,
        name:displayName,
        email:email,
        photo:photoURL
      }
      setUser(signedInUser);
      console.log(displayName,email,photoURL);
    })
    .catch(err=>{
      console.log(err);
      console.log(err.message);
    })
  }

  const handelSignOut =()=>{
    firebase.auth().signOut()
    .then(res =>{
      const signOutUser ={
        isSignedIn:false,
        name:' ',
        photo:'',
        email:''
      }
      setUser(signOutUser);
    })
    .catch(err =>{

    })
  }
  return (
    <div className="App">
      {
        user.isSignedIn?<button onClick={handelSignOut}>Sign Out </button>:<button onClick={handelSignIn}>Sign in </button>
        
      }
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your Email :{user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
    </div>
  );
}

export default App;

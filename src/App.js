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
    password:'',
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
      console.log(res);
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
  const handelBlur= (e) =>{
   let isFieldValid = true;
    if(e.target.name === 'email'){
       isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
      
    }
    if(e.target.name === 'password'){
      const isPasswordValid = e.target.value.length> 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = passwordHasNumber && isPasswordValid;
    }
    if(isFieldValid){
      const newUserInfo = {...user};
      newUserInfo[e.target.name]= e.target.value;
      setUser(newUserInfo);
    }
  }
  const handelSubmit =(e)=>{
    if(user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
    // ..
  });

    }
    e.preventDefault();
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

      <h1>Our Own Authentication</h1>
      
      <form onSubmit={handelSubmit}>
      <input type="text" name='name' placeholder='Your name' onBlur={handelBlur}/>
        <br/>
      <input type="text" name='email' onBlur={handelBlur} placeholder='your email address' required/>
      <br/>
      <input type="password" name='password' onBlur={handelBlur} placeholder='Password' required/>
      <br/>
      <input type="submit" value="Submit"/>
      </form>
    </div>
  );
}

export default App;

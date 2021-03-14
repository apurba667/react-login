import firebase from "firebase/app";
import "firebase/auth";
import { useState } from "react";
import './App.css';
import firebaseConfig from "./fireBaseConfiq";

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: ' ',
    email: ' ',
    password: '',
    photo: ' '
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  var fbProvider = new firebase.auth.FacebookAuthProvider();
  const handelSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
        console.log(res);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
  }

  const handelFbSignIn= ()=>{
    firebase
  .auth()
  .signInWithPopup(fbProvider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // The signed-in user info.
    var user = result.user;
    console.log('Fb User After sign in',user);
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
  });

  }
  const handelSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signOutUser = {
          isSignedIn: false,
          name: ' ',
          photo: '',
          email: '',
          error: '',
          success: false
        }
        setUser(signOutUser);
      })
      .catch(err => {

      })
  }
  const handelBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);

    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = passwordHasNumber && isPasswordValid;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }
  const handelSubmit = (e) => {
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then((userCredential) => {
          // Signed in 
          const newUserInfo = { ...user };
          newUserInfo.error = ' ';
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(user.name);
          console.log(user.name);
          var user = userCredential.user;
          // ...
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
          // ..
        });

    }

    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((userCredential) => {
          // Signed in
          const newUserInfo = { ...user };
          newUserInfo.error = ' ';
          newUserInfo.success = true;
          setUser(newUserInfo);
          console.log('sign in user info', userCredential.user);
          var user = userCredential.user;
          // ...
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }

    e.preventDefault();
  }

  const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name
      
    }).then(function () {
      console.log('User name updated successfully');
      // Update successful.
    }).catch(function (error) {
      console.log(error);
      // An error happened.
    });
  }
  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handelSignOut}>Sign Out </button> : <button onClick={handelSignIn}>Sign in </button>

      }
      <br/>
      <br/>
      <button onClick={handelFbSignIn}>Sign in using facebook</button>
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your Email :{user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }

      <h1>Our Own Authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name='newUser' id='' />
      <label htmlFor="newUser">New User Sign up</label>
      <form onSubmit={handelSubmit}>
        {newUser && <input type="text" name='name' placeholder='Your name' onBlur={handelBlur} />}
        <br />
        <input type="text" name='email' onBlur={handelBlur} placeholder='your email address' required />
        <br />
        <input type="password" name='password' onBlur={handelBlur} placeholder='Password' required />
        <br />
        <input type="submit" value={newUser? "Sign up" : "Sign in"} />
      </form>
      <p style={{ color: 'red' }}> {user.error}</p>
      {
        user.success && <p style={{ color: 'green' }}>User {newUser ? 'Created' : 'Logged in'} successfully </p>
      }
    </div>
  );
}

export default App;

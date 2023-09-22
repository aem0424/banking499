import React, {useState} from "react";
import Axios from 'axios';
import './App.css';

function App() {

  const [usernameReg, setUsernameReg] = useState("");
  const [passReg, setPassReg] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPass] = useState("");

  const [loginStatus, setLoginStatus] = useState("");

  const register = () => {
    Axios.post('http://localhost:3001/register', {
      username: usernameReg, 
      password : passReg,
    }).then((response) => {
      if(response.data.length > 0)
      console.log(response);
    })
  }

  const login = () => {
    Axios.post('http://localhost:3001/login', {
      username: username, 
      password : password,
    }).then((response) => {
      if(response.data.message){
        setLoginStatus(response.data.message)
      }else{
        setLoginStatus(response.data[0].username)
      }
      console.log(response.data);
    })
  }

  return (
    <div className="App">
      <div className="Registration">
        <h1>Registration</h1>
        <label>Username: </label>
        <input type="text" onChange={(e)=> {setUsernameReg(e.target.value);}}/>
        <label>Password: </label>
        <input type="text" onChange={(e)=> {setPassReg(e.target.value);}}/>
        <button onClick={register}>Register</button>
      </div>


      <div className="Login">
        <h1>Login</h1>
        <input type="text" placeholder = "Username"onChange={(e)=> {setUsername(e.target.value);}}/>
        <input type ="password" placeholder="Password"onChange={(e)=> {setPass(e.target.value);}}/>
        <button onClick={login}>Login</button>
      </div>
      <h1>{loginStatus}</h1>
    </div>
  );
}

export default App;

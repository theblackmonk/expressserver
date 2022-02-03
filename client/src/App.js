import logo from './logo.svg';
import './App.css';

function App() {
  var the_interval = 100;
  setInterval(function() {
    fetch("http://localhost:5000/data")
    .then(res => res.json())
    .then(data => console.log(data))
  }, the_interval);
  
  fetch("http://localhost:5000/data")
  .then(res => res.json())
  .then(data => console.log(data))
  return (
    <h1>Hello World</h1>
  );
}

export default App;

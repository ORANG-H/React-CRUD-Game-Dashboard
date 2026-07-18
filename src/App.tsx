import "./App.css";
// import Navigation from "./comps/Navigation.js"
// import Dashboard from './comps/Dashboard.js'
 import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import ItemCard from "./comps/ItemCard.tsx";

function App() {

 


  return (
    <>
    {/* <Navigation value={clicked}/> */}
      <ItemCard   currentMoney={100}/>
       
      </>
  );
}

export default App;
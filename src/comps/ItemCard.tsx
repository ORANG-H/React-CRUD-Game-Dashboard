import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import  { useState, useEffect } from 'react';


interface CartItem {
  id: string | number;
  name: string;
  price: string | number;

}
interface items {
  id: string | number;
  name: string;
  price: string | number;
  type : string ;
  power : string;
  image : string;
}

function ItemCard({currentMoney} : {currentMoney: number }){
  const [isInvisible, setisInvisible] = useState(false);
  const [isInvisibleSave, setisInvisibleSave] = useState(false);

  const[money , setMoney] = useState(currentMoney)
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [items, setItems] = useState<items[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const [editingId, setEditingId] = useState<string | number | null>(null);

const [editName, setEditName] = useState("");
const [editPrice, setEditPrice] = useState("");
const [editPower, setEditPower] = useState("");
const [editType, setEditType] = useState("");
const [editImage, setEditImage] = useState("");

  const [getId, setGetId] = useState<string>("");
const [getName, setGetName] = useState<string>("");
const [getPower, setGetPower] = useState<string>("");
const [getPrice, setGetPrice] = useState<string>("");
const [getType, setGetType] = useState<string>("");
const [getImgUrl, setImgUrl] = useState<string>("");


function makeNewItem(){
fetch(`${import.meta.env.VITE_MOCK_API_URL}/posts`, {
  method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id : getId,
      name: getName,
      price : getPrice,
      power : getPower,
      image : getImgUrl , 
      type: getType
        
    })
})
.then(res => {
  if (!res.ok) throw new Error('Failed to add item');
  return res.json();
})
.then(data => {
    // Add the new item with the correct format
    const newItem: items = {
      id: data.id || Date.now(),
      name: getName,
      price: Number(getPrice),
      power: getPower,
      type: getType,
      image: getImgUrl
    };
    setItems(prev => [...prev, newItem]);
    // Clear form fields
    setGetId("");
    setGetName("");
    setGetPrice("");
    setGetPower("");
    setImgUrl("");
    setGetType("");
})
.catch(err => {
  console.error('Error adding item:', err);
  // Add item locally if API fails
  const newItem: items = {
    id: Date.now(),
    name: getName,
    price: Number(getPrice),
    power: getPower,
    type: getType,
    image: getImgUrl
  };
  setItems(prev => [...prev, newItem]);
  setGetId("");
  setGetName("");
  setGetPrice("");
  setGetPower("");
  setImgUrl("");
  setGetType("");
});


}
  useEffect(() => {
    const fetchShopItems = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_MOCK_API_URL}/posts`;
        console.log('Fetching from:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const posts: any[] = await response.json();
        // Transform posts to items format (take first 10)
        const transformedItems: items[] = posts.slice(0, 10).map((post: any) => ({
          id: post.id,
          name: `Item ${post.id}`,
          price: 25 + (post.id * 5),
          type: "Game Item",
          power: String((post.id % 5) + 1),
          image: `https://via.placeholder.com/150?text=Item${post.id}`
        }));
        
        setItems(transformedItems);
        setError(null); // Clear error on success
      } catch (err: any) {
        console.error('Fetch error:', err);
        
        // Fallback: Load sample data if API fails
        const sampleItems: items[] = [
          {
            id: 1,
            name: "Sword",
            price: 50,
            type: "Weapon",
            power: "5",
            image: "https://via.placeholder.com/150?text=Sword"
          },
          {
            id: 2,
            name: "Shield",
            price: 75,
            type: "Armor",
            power: "3",
            image: "https://via.placeholder.com/150?text=Shield"
          },
          {
            id: 3,
            name: "Helmet",
            price: 40,
            type: "Armor",
            power: "2",
            image: "https://via.placeholder.com/150?text=Helmet"
          }
        ];
        setItems(sampleItems);
        setError("Using sample data - API unavailable");
      } finally {
        setLoading(false);
      }
    };

    fetchShopItems();
  }, []);

  async function deleteItem(id: string | number) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_MOCK_API_URL}/posts/${id}`,
      {
        method: "DELETE"
      }
    );
    if (!response.ok) throw new Error('Failed to delete item');
    setItems(prev => prev.filter(item => item.id !== id));
  }
  catch(err: any){
    console.error('Error deleting item:', err);
    // Delete locally even if API fails
    setItems(prev => prev.filter(item => item.id !== id));
  }
}


async function updateItem(id:string | number){
  try {
    const updatedItem = {
        name: editName,
        price: editPrice,
        power: editPower,
        type: editType,
        image: editImage
    };

    const response = await fetch(
      `${import.meta.env.VITE_MOCK_API_URL}/posts/${id}`,
      {
        method: "PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(updatedItem)
      }
    );

    if (!response.ok) throw new Error('Failed to update item');
    
    // Update locally
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              name: editName,
              price: Number(editPrice),
              power: editPower,
              type: editType,
              image: editImage
            }
          : item
      )
    );

    setEditingId(null);
    setisInvisibleSave(false);
  } catch(err: any) {
    console.error('Error updating item:', err);
    // Update locally even if API fails
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              name: editName,
              price: Number(editPrice),
              power: editPower,
              type: editType,
              image: editImage
            }
          : item
      )
    );
    setEditingId(null);
    setisInvisibleSave(false);
  }
}

  function handleBuy(item: any) {
    if (money < item.price) return alert ("No enough cash! stranger.");

    setMoney(prev => prev - item.price);

    const newItem: CartItem = {
      id: item.id,
      name: item.name,
      price: item.price
    };
setCartItems(prev => [...prev, newItem]);

    console.log("Cart:", [...cartItems, newItem]);
  

 }

return(<>

        <nav className="navbar  bg-dark fixed-top mb-1 p-1">
      <div className="container-fluid">
        <a className="navbar-brand text-light">Game Dashboard</a>
        <form className="d-flex" role="search">
          <button className="btn d-block  h-25 mt-4 me-3 text-bg-success rounded bg-success" 
          onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
    setisInvisible(prev => !prev);
          }
           }> ✙ </button>

          <div className='bg-dark w-50 h-25 me-3 ms-3'>

            <br />
            <span className='bg-dark text-light'> You have   <br />
            <strong><span className='text-success m-3 bolder' >{money}$</span> </strong> </span>
             
              




          
          </div>
          
          <div className="btn-group me-5" role="group">
           <button type="button" className="btn btn-primary dropdown-toggle h-25 h-50 w-50 m-2 mt-4" data-bs-toggle="dropdown" aria-expanded="false">
      🛒 {cartItems.length}
    </button>
    <ul className="dropdown-menu dropdown-menu-end" style={{ maxHeight: '400px', overflowY: 'auto' }}>
    

       
       
       {cartItems.map((item, index) => (
        <li key={index} className="dropdown-item d-flex justify-content-between align-items-center" style={{userSelect: "none"}}>
            <span>{item.name}</span>  <span className="text-success">{item.price}$</span>
            <button className="btn btn-danger btn-sm" onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMoney(Number(item.price)+money);
              setCartItems(cartItems.filter((_, i) => i !== index));
            }}> ❌</button>
        </li>
      ))}
    </ul>
                </div>

        </form>
      </div>
    </nav>

    

<br />

<div className="m-5">
    <div className={isInvisible ? " d-flex justify-content-end " :" d-flex justify-content-end invisible" }>
        <div className="btn-group w-25 d-flex justify-content-end " role="group" aria-label="Basic outlined example">
  <button type="button" className="btn btn-outline-primary" onClick={()=>setMoney(money+100)}>Add 100$</button>
  <button type="button" className="btn btn-outline-primary" onClick={()=>setMoney(0)} >Reset to 0</button>
  <button type="button" className="btn btn-outline-primary" onClick={()=>setMoney(money+400)}>Add 400$</button>
</div>
</div>


  {loading && <div className="alert alert-info">Loading items...</div>}
  {error && <div className="alert alert-danger">Error: {error}</div>}
  
  {!loading && items.map((item) => (
        <div className="card m-2 p-1  "  

          key={item.id}>
            <div className="card-body">
           <img src={item.image} alt={item.name} className="float-start m-3"/>
     
{
editingId === item.id ? <input value={editName} onChange={(e)=>setEditName(e.target.value)}/>:<h3>{item.name}</h3>}
          <h5><p className="text-success" 
          style={{ cursor: 'pointer' ,  userSelect: "none",  outline: "none"}}  onClick={() => handleBuy(item)} 
          >{item.price}$</p></h5>

          <p>{item.power}</p>
          <p className={  "text-secondary mb-5 d-inline-block"}>{item.type}</p>

          <div className="d-flex justify-content-end align-items-center ">
            
             <button
  className={isInvisibleSave ?"btn btn-success m-1": "btn btn-success m-1 invisible"}
  onClick={() => updateItem(item.id)}
>
    Save
</button>

            <button className={"btn btn-outline-primary btn-sm me-2"} onClick={() => {
                  setisInvisibleSave(prev => !prev);



      setEditingId(item.id);
      setEditName(item.name);
      setEditPrice(String(item.price));
      setEditPower(item.power);
      setEditType(item.type);
      setEditImage(item.image);
  }} >✎ Edit</button>

 

            <button className="btn btn-danger btn-sm" onClick={()=> deleteItem(item.id)}>❌</button>
          </div>

          </div>
        </div>
    
      ))}
          <h1>Please add a new element</h1>
          <label >ID</label>
    <input type="Number" className="form-control" id="Id" aria-describedby="emailHelp" placeholder="Enter Id..." onChange={e=> setGetId(e.target.value)}/>
              <label >Name</label>

    <input type="text" className="form-control" id="Name" aria-describedby="emailHelp" placeholder="Enter Name..."onChange={e=> setGetName(e.target.value)}/>
              <label >Price $$$</label>

    <input type="number" className="form-control" id="Price" aria-describedby="emailHelp" placeholder="Enter Price..." onChange={e=> setGetPrice(e.target.value)}/>
              <label >Power</label>
              
     <input type="text" className="form-control" id="Power" aria-describedby="emailHelp" placeholder="Enter Power..." onChange={e=> setGetPower(e.target.value)}/>
              <label >Image url</label>
    
     <input type="text" className="form-control" id="Imgurl" aria-describedby="emailHelp" placeholder="Enter Image Url..." onChange={e=> setImgUrl(e.target.value)}/>
               <label >Type</label>

    <input type="text" className="form-control" id="Type" aria-describedby="emailHelp" placeholder="Enter Type..." onChange={e=> setGetType(e.target.value)}/>
    <div className="w-100 d-flex justify-content-center m-3">
    <button className="btn btn-primary  bg-info d-flex " onClick={makeNewItem}> Add!</button>
    </div>
  
</div>


</>)




}
export default ItemCard
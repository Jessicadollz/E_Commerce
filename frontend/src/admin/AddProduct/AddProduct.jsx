import axios from "../axiosConfig";
import { useState } from "react";
import style from "./AddProduct.module.css";

function AddProduct() {
  const [data, setData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    description: "",
    inStock: "",
    inventory: "",
    url: "",
  });

  function handleChange(e) {
    if (e.target.files) {
      setData({ ...data, url: e.target.files[0] });
    } else setData({ ...data, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      // formData.append("name", data.name)
      // formData.append("brand", data.brand)
      // formData.append("category", data.category)
      // formData.append("price", data.price)
      // formData.append("description", data.description)
      // formData.append("inStock", data.inStock)
      // formData.append("inventory", data.inventory)
      // formData.append("brand", data.brand)
      for (const key in data) {
        if (Object.hasOwn(data, key)) {
          formData.append(key, data[key]);
        }
      }

      const response = await axios.post("/product", formData);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
    <div className={style.addProductContainer}> 
      {/* <h1>Add Product</h1> */}
    <form action="" encType="multipart/form-data" onSubmit={handleSubmit} className={style.addProductForm}>
    <h1>Add Product</h1>
      <input
        type="text"
        name="name"
        value={data.name}
        onChange={handleChange}
        placeholder="Enter name"
      />
      <input
        type="text"
        name="brand"
        value={data.brand}
        onChange={handleChange}
        placeholder="Enter brand"
      />
      <input
        type="text"
        name="category"
        value={data.category}
        onChange={handleChange}
        placeholder="Enter category"
      />
      <input
        type="text"
        name="price"
        value={data.price}
        onChange={handleChange}
        placeholder="Enter price"
      />
      <input
        type="text"
        name="description"
        value={data.description}
        onChange={handleChange}
        placeholder="Enter description"
      />
      <input
        type="text"
        name="inStock"
        value={data.inStock}
        onChange={handleChange}
        placeholder="Enter inStock"
      />
      <input
        type="text"
        name="inventory"
        value={data.inventory}
        onChange={handleChange}
        placeholder="Enter inventory"
      /> <br />
      <input type="file" name="url" onChange={handleChange} />
      <button type="submit" className={style.addProductButton}>Add Product</button>
    </form>
    </div>
    </>
  );
}

export default AddProduct;
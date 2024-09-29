/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../axiosConfig";
import style from "./Dashboard.module.css";

function Dashboard({ setIsLoggedIn }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  let count = useRef(0);

  useEffect(() => {
    isUserLoggedIn();
  }, []);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  async function fetchAllProducts() {
    try {
      const response = await instance.get("/product");
      setProducts(response.data);
    } catch (err) {
      console.log("Error fetching products: " + err);
    }
  }

  async function isUserLoggedIn() {
    try {
      const response = await instance.get("/user/loggedIn");
      if (response.statusText === "OK") setIsLoggedIn(true);
      else setIsLoggedIn(false);
    } catch (err) {
      console.log("Error checking login status: " + err);
    }
  }

  async function handleLogout() {
    const response = await instance.post("/user/logout", {});
    if (response.data.message === "Logout successfully")
      navigate("/admin/login");
  }

  async function handleProductDelete(idToDelete) {
    try {
      const response = await instance.delete("/product/" + idToDelete, {
        withCredentials: true,
      });
      if (response.data.message === "Product Deleted") fetchAllProducts();
    } catch (err) {
      console.log("Error deleting product: " + err);
    }
  }

  function getSelectedProduct(product) {
    navigate("/admin/product", { state: { singleProduct: product } });
  }

  return (
    <>
      <div className={style.dashboardContainer}>
        <header className={style.dashboardHeader}>
          <div></div>
          <div>
            <h2 style={{ textAlign: "center" }}>Welcome Admin</h2>
          </div>
          <div>
            <button onClick={handleLogout} className={style.dashboardLogoutButton}>
              Logout
            </button>
          </div>
        </header>
        <main className={style.dashboard}>
          <h2 style={{textAlign:"center"}}>Manage Products</h2>
          <div className={style.productCardContainer}>
            {products.map((product, index) => {
              return (
                <div key={product._id} className={style.productCard}>
                  <h3>{index + 1}. {product.name}</h3>
                  <p>Price: {product.price}</p>
                  <div className={style.cardActions}>
                    <button
                      onClick={() => getSelectedProduct(product)}
                      className={style.viewButton}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleProductDelete(product._id)}
                      className={style.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <Link to="/admin/add">Add a New Product</Link>

        </main>
      </div>
    </>
  );
}

export default Dashboard;
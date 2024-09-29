import { useLocation } from "react-router-dom";

function SingleProduct() {
  const location = useLocation();
  const { singleProduct } = location.state;
  console.log(singleProduct);

  return (
    <>
      <div className="singleProduct">
        <h3>{singleProduct.name}</h3>
        <p>Category: {singleProduct.category}</p>
        <p>Description: {singleProduct.description}</p>
        <p>Price: {singleProduct.price}</p>
      </div>
    </>
  );
}

export default SingleProduct;
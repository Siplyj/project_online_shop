import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import classes from './ProductPage.module.css';

function ProductPage() {
  const { category, product_url } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [imageNumber, setImageNumber] = useState('01');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/files/products.json`);
        if (!response.ok) {
          throw new Error('File upload error');
        }

        const data = await response.json();

        const foundProduct = data.find((item) => item.url === product_url);
        setProduct(foundProduct);

        if (foundProduct && foundProduct.sizes.length > 0) {
          setSelectedSize(foundProduct.sizes[0]);
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [category, product_url]);

  if (loading) return <div>Loading product...</div>;
  if (!product) return <div>Product not found</div>;

  const handlePrevSlide = () => {
    setImageNumber((prev) => {
      let num = parseInt(prev, 10);
      num = num - 1;
      if (num < 1) {
        num = product.number_of_images;
      }
      return num.toString().padStart(2, '0');
    });
  };

  const handleNextSlide = () => {
    setImageNumber((prev) => {
      let num = parseInt(prev, 10);
      num = num + 1;
      if (num > product.number_of_images) {
        num = 1;
      }
      return num.toString().padStart(2, '0');
    });
  };

  return (
    <div className={classes.product_wrapper} >
      <div className={classes.product_slider} >
        <div className={classes.product_slider_big_image}>

          <button onClick={handlePrevSlide} className={classes.product_slider_next_slide}>
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </button>

          <img
            src={`../files/catalog/${category}/${product.id.slice(-2)}_${product.url}/${imageNumber}.webp`}
            alt={product.name}
            className={classes.product_big_image}
          />

          <button onClick={handleNextSlide} className={classes.product_slider_prev_slide}>
            <span className="material-symbols-outlined">arrow_forward_ios</span>
          </button>

        </div>

        <div className={classes.product_slider_small_images}>

          {Array.from({ length: product.number_of_images }, (elem, index) => {
            const imgNumber = (index + 1).toString().padStart(2, '0');
            return (
              <div key={imgNumber} className={classes.product_small_image_wrapper}>
                <img
                  src={`../files/catalog/${category}/${product.id.slice(-2)}_${product.url}/${imgNumber}.webp`}
                  alt={`${product.name} ${imgNumber}`}
                  className={`${classes.product_small_image} ${imgNumber === imageNumber ? classes.product_small_image_selected : ''}`}
                  onClick={() => setImageNumber(imgNumber)}
                />
              </div>
            );
          })}

        </div>

      </div>

      <div className={classes.product_data}>
        <h1 className={classes.product_name}>{product.name}</h1>
        <span className={classes.product_price}>${product.price}</span>
        {product.price_before_discount && (
          <span className={classes.price_before_discount}>${product.price_before_discount}</span>
        )}
        <p className={classes.product_sizes_title}>Sizes</p>
        <div className={classes.product_sizes}>
          {product.sizes.map((size) => (
            <span
              key={size}
              className={size === selectedSize ? classes.product_selected_size : classes.product_size}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </span>
          ))}
        </div>
        <button className={classes.product_cart_button}>
          Add to cart
        </button>
      </div>
      
      {/*<p>{product.description}</p>
      
      <p><strong>Material:</strong> {product.material}</p>
      <p><strong>Country of origin:</strong> {product.countryOfOrigin}</p>*/}
      
    </div>
  );
}

export default ProductPage;
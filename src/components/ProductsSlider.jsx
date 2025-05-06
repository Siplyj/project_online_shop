import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import classes from './ProductsSlider.module.css';

const ProductsSlider = ({title, description, gender}) => {
  const [products, setProducts] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerRow, setItemsPerRow] = useState(1);
  const [cardWidth, setCardWidth] = useState(220);
  const [buttonTop, setButtonTop] = useState('50%');

  const wrapperRef = useRef(null);
  const firstImageRef = useRef(null);

  const MIN_CARD_WIDTH = 220;
  const GAP = 20;

  const updateButtonTop = () => {
    if (firstImageRef.current) {
      const imageHeight = firstImageRef.current.offsetHeight;
      setButtonTop(`${imageHeight / 2}px`);
    }
  };

  // Counting the number of product cards displayed on the page
  const updateLayout = () => {
    if (!wrapperRef.current) return;

    const containerWidth = wrapperRef.current.offsetWidth;

    const fullItemWidth = MIN_CARD_WIDTH + GAP;
    let maxItems = Math.floor((containerWidth + GAP) / fullItemWidth);
    if (maxItems < 1) maxItems = 1;

    const totalGaps = (maxItems - 1) * GAP;
    const calculatedCardWidth = (containerWidth - totalGaps) / maxItems;

    setItemsPerRow(maxItems);
    setCardWidth(calculatedCardWidth);
  };

  useEffect(() => {
    updateButtonTop();
  }, [cardWidth]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await loadProducts();
        setProducts(data.filter(product => product.gender === gender));
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };

    fetchProducts();
    updateLayout();

    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  // Pressing the next button
  const handleNext = () => {
    if (startIndex + itemsPerRow < products.length) {
      setStartIndex(startIndex + 1);
    }
  };

  // Pressing the prev button
  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const loadProducts = async () => {
    const response = await fetch('/files/products.json');
    if (!response.ok) throw new Error('Error loading products');
    return await response.json();
  };

  return (
    <div className={classes.mainpage_products_wrapper}>
      <p className={classes.mainpage_products_title}>{title}</p>
      {description && <p className={classes.mainpage_products_description}>{description}</p>}

      <section className={classes.mainpage_products_outer_wrapper}>
        <button
          className={classes.mainpage_prev_card}
          style={{ top: buttonTop }}
          onClick={handlePrev}
          disabled={startIndex === 0}
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>

        <div className={classes.mainpage_products_cards_wrapper} ref={wrapperRef}>
          <div
            className={classes.mainpage_products_cards}
            style={{ transform: `translateX(-${startIndex * (cardWidth + GAP)}px)` }}
          >
            {
              products.map((product, index) => (
                <Link
                  key={product.id}
                  to={`/${gender}/${product.url}`}
                  className={classes.mainpage_product_card}
                  style={{ width: `${cardWidth}px` }}
                >
                  <div className={classes.mainpage_product_image}>

                    {
                      product.price_before_discount &&
                      <div className={classes.mainpage_product_discount}>
                        -{Math.floor(100 * (1 - product.price / product.price_before_discount))}%
                      </div>
                    }

                    <img
                      src={`/files/catalog/${gender}/${product.id.slice(-2)}_${product.url}/01.webp`}
                      alt={product.name}
                      loading="lazy"
                      ref={index === 0 ? firstImageRef : null}
                      onLoad={index === 0 ? updateButtonTop : undefined}
                    />

                  </div>
                  <div className={classes.mainpage_product_details}>
                    <h3 className={classes.mainpage_product_name}>{product.name}</h3>
                    <div className={classes.mainpage_product_prices}>
                      {product.price_before_discount ? (
                        <>
                          <span className={classes.mainpage_price}>
                            {product.price.toFixed(2)} €
                          </span>
                          <span className={classes.mainpage_old_price}>
                            {product.price_before_discount.toFixed(2)} €
                          </span>
                        </>
                      ) : (
                        <span className={classes.mainpage_price}>
                          {product.price.toFixed(2)} €
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>
        </div>

        <button
          className={classes.mainpage_next_card}
          style={{ top: buttonTop }}
          onClick={handleNext}
          disabled={startIndex + itemsPerRow >= products.length}
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </section>
    </div>
  );
};

export default ProductsSlider;
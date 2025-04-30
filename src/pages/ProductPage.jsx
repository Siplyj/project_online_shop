import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ProductPage() {
  const { category, product_url } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/files/products-${category}.json`);
        if (!response.ok) {
          throw new Error('File upload error');
        }

        const data = await response.json();

        const foundProduct = data.find((item) => item.url === product_url);
        setProduct(foundProduct);
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

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      {product.discount_price && (
        <p><strong>Price before discount:</strong> ${product.discount_price}</p>
      )}
      <p><strong>Material:</strong> {product.material}</p>
      <p><strong>Country of origin:</strong> {product.countryOfOrigin}</p>
      <p><strong>Sizes:</strong> {product.sizes.join(', ')}</p>
    </div>
  );
}

export default ProductPage;
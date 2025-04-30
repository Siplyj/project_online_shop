import { useParams } from 'react-router-dom';

const CatalogPage = () => {
  const { category } = useParams();
  return <div>Catalog: {category}</div>;
};

export default CatalogPage;
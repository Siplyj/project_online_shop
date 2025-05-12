import { useParams } from 'react-router-dom';

const CatalogPage = () => {
  const { category } = useParams();
  return (
    <>
      <h1 style={{ textAlign: "center", fontSize: "1.5rem", marginTop: "20px" }}>
          Oops! This page is coming soon
      </h1>
  </>

  );
};

export default CatalogPage;
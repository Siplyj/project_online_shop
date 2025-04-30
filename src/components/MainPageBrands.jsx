import classes from './MainPageBrands.module.css';

const MainPageBrands = () => {
  const brand_logos = import.meta.glob('/src/files/brands_logo/*.{jpg,jpeg,png,webp}', { eager: true });
  const brandImagesArray = Object.values(brand_logos).map((img) => img.default);

  // Дублируем логотипы для плавной бесконечной прокрутки
  const doubleImages = [...brandImagesArray, ...brandImagesArray];

  return (
    <div className={classes.mainpage_brands_outer_wrapper}>
      <div className={classes.mainpage_brands_wrapper}>
        <p className={classes.mainpage_brands_title}>Our brands</p>

        <div className={classes.mainpage_brands_slider}>
          <div className={classes.mainpage_brands_slideTrack}>
            {doubleImages.map((src, index) => (
              <img key={index} src={src} alt={`brand-${index}`} className={classes.mainpage_brands_slide} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPageBrands;
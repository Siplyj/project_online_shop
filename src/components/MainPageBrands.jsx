import classes from './MainPageBrands.module.css';

const MainPageBrands = () => {
  const brandImagesArray = [];

  for (let i = 1; i < 9; i++) {
    brandImagesArray.push(`./files/mainpage/brands_logo/brand-logo-0${i}.png`);
  }

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
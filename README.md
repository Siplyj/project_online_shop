# Shopping Cart Page:

### Project overview
* About project
* Features
* Technologies used
* Link to GitHub Pages

**About project**

An online clothing store built with modern front-end technologies. The application allows users to browse a catalog of products, view detailed product pages, add items to a shopping cart, adjust quantities, and place orders. The project focuses on delivering a clean and responsive user experience, efficient state management, and intuitive navigation.

The platform includes user authentication, personalized experiences, and e-commerce functionality backed by cloud services.

**Features**

- Individual product detail pages with images and size options
- Add-to-cart functionality with quantity adjustments
- Shopping cart page with total price calculation
- Confirmation modal for sensitive actions like item removal
- Navigation across catalog and product pages
- User registration and login powered by AWS Amplify and Cognito
- Add products to favorites, with the list stored in AWS DynamoDB
- View and manage orders, with order history stored in AWS DynamoDB
- Test payments via Stripe (using test card 4242 4242 4242 4242)
- Backend serverless API deployed on AWS Lambda
- Clean and maintainable code structure

**Technologies used**

- React - for building dynamic and reusable UI components
- Redux Toolkit - for centralized state management (cart, products, favorites, user session)
- React Router - for client-side routing and navigation
- CSS Modules - for scoped, maintainable styling
- Material Symbols - for consistent and modern iconography
- Vite - as the build tool for fast development and optimized production builds
- AWS Amplify & Cognito - for authentication and user management
- AWS Lambda - serverless backend handling API requests
- AWS DynamoDB - for storing favorites and order data
- Stripe - for testing payment integration

**Link to GitHub Pages**

https://siplyj.github.io/project_online_shop/
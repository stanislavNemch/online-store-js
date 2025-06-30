# Online Store JS

This project is a front-end implementation of an online store, allowing users to
browse products, filter by categories, search for items, and manage a shopping
cart.

## Features

- **Product Listing:** View a paginated list of available products.
- **Category Filtering:** Filter products by categories.
- **Product Search:** Search for specific products by name.
- **Product Details:** View more details about a product (likely via a modal).
- **Shopping Cart:** Add products to a shopping cart, view cart contents, and
  simulate a purchase.
- **Wishlist:** (Functionality present via `wishlist.html` and `wishlist.js`)
- **Responsive Design:** The interface adapts to different screen sizes.
- **Notifications:** User feedback through toast notifications (e.g., for adding
  to cart, errors).

## Technologies Used

- **Frontend:**
  - HTML5
  - CSS3
  - Vanilla JavaScript (ES6 Modules)
- **Build Tool:**
  - [Vite](https://vitejs.dev/)
- **Libraries:**
  - [axios](https://axios-http.com/): For making HTTP requests to the product
    API.
  - [izitoast](https://izitoast.marcelodolza.com/): For displaying toast
    notifications.
- **Deployment:**
  - [GitHub Pages](https://pages.github.com/)

## Getting Started

These instructions will get you a copy of the project up and running on your
local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (which includes npm) installed on your system.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd online-store-js
    ```

    (Replace `<repository-url>` with the actual URL of this repository. If
    you've already cloned it, you can skip this step.)

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Project

- **Development mode:** This command will start the Vite development server,
  usually on `http://localhost:5173` (the port might vary). The browser will
  likely open automatically, and the page will hot-reload upon changes.

  ```bash
  npm run dev
  ```

- **Build for production:** This command will create a `dist` folder with the
  optimized static assets for deployment.

  ```bash
  npm run build
  ```

- **Preview production build:** This command will serve the `dist` folder
  locally, allowing you to check the production build before deployment.
  ```bash
  npm run preview
  ```

## Project Structure

```
online-store-js/
├── dist/                   # (Generated) Production build files
├── public/                 # Static assets (e.g., favicon)
├── src/
│   ├── css/                # CSS stylesheets
│   ├── img/                # Image assets
│   ├── js/                 # JavaScript modules
│   │   ├── constants.js    # Global constants (e.g., API base URL)
│   │   ├── handlers.js     # Event handlers
│   │   ├── helpers.js      # Utility functions
│   │   ├── modal.js        # Modal logic
│   │   ├── products-api.js # API interaction functions
│   │   ├── refs.js         # DOM element references
│   │   ├── render-function.js # Functions to render HTML content
│   │   └── storage.js      # Local storage utilities
│   ├── partials/           # HTML partials (header, modal)
│   ├── cart.html           # HTML for the shopping cart page
│   ├── cart.js             # JS logic for the cart page
│   ├── home.js             # JS logic for the home page
│   ├── index.html          # Main HTML entry point
│   ├── wishlist.html       # HTML for the wishlist page
│   └── wishlist.js         # JS logic for the wishlist page
├── .gitignore              # Specifies intentionally untracked files
├── package.json            # Project metadata and dependencies
├── package-lock.json       # Records exact versions of dependencies
└── vite.config.js          # Vite configuration file
```

## API

This project interacts with an external API to fetch product data. The base URL
for this API is expected to be defined in `src/js/constants.js`. (The project
appears to use `https://dummyjson.com` as the base API endpoint as per
`src/js/constants.js`).

## Contributing

Contributions are welcome! If you'd like to contribute:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeatureName`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/YourFeatureName`).
6.  Open a Pull Request.

## License

This project is licensed under the ISC License.

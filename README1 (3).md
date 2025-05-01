# React  E-Commerce Dashboard

## Project Overview
This project is a modern e-commerce dashboard built with React, , and Tailwind CSS. It features a task management system, product catalog, favorites list, and shopping cart functionality.

## Learning Objectives
By completing this project, you will learn:
- Modern React patterns and best practices
- State management in React applications
- Routing with React Router
- Styling with Tailwind CSS
- Component composition and reusability
- Modern development workflow with Vite
- Working with external APIs

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Basic knowledge of JavaScript
- Understanding of React fundamentals

## Project Setup
1. create the repository:
```bash
and setup your project 
npm create vite@latest my-app -- --template react
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── App.tsx        # Main application component
└── main.tsx       # Application entry point
```

## API Integration
This project uses the [FakeStore API](https://fakestoreapi.com/) to fetch product data. The API provides a collection of fake product data that can be used for development and testing purposes.

### API Endpoints Used:
- `GET https://fakestoreapi.com/products` - Fetches all products
- `GET https://fakestoreapi.com/products/{id}` - Fetches a single product by ID
- `GET https://fakestoreapi.com/products/categories` - Fetches all product categories
- `GET https://fakestoreapi.com/products/category/{category}` - Fetches products by category

### Example API Response:
```json
[
  {
    "id": 1,
    "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    "price": 109.95,
    "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    "category": "men's clothing",
    "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    "rating": {
      "rate": 3.9,
      "count": 120
    }
  }
]
```

### API Usage in the Project:
The Products page (`src/pages/Products.tsx`) demonstrates how to:
- Fetch data from the API using the Fetch API
- Handle loading states while data is being fetched
- Handle error states if the API request fails
- Display the fetched data in a responsive grid layout
- Implement favorites and cart functionality using local storage

## Features to Implement
1. **Navigation**
   - Create a responsive navigation bar
   - Implement routing between different pages
   - Add active state indicators for current route

2. **Dashboard**
   - Display key metrics and statistics
   - Create a clean and intuitive layout
   - Add data visualization components

3. **Task Manager**
   - Implement CRUD operations for tasks
   - Add task filtering and sorting
   - Create task status indicators
   - Implement task priority levels

4. **Products Page**
   - Create a product grid/list view
   - Implement product filtering and search
   - Add product categories
   - Create product detail view

5. **Favorites**
   - Implement add/remove from favorites
   - Create a favorites list view
   - Add sorting and filtering options

6. **Shopping Cart**
   - Implement add/remove from cart
   - Create cart total calculation
   - Add quantity adjustment
   - Implement checkout process

## Technical Requirements
- Implement proper error handling
- Create reusable components
- Follow React best practices
- Use Tailwind CSS for styling
- Implement responsive design
- Add loading states and error boundaries
- Include proper documentation
- Integrate with the FakeStore API

## Bonus Challenges
1. Add authentication and user management
2. Implement data persistence with localStorage
3. Add animations and transitions
4. Create a dark mode theme
5. Implement unit tests
6. Add form validation
7. Create a backend API integration
8. Implement product filtering by category
9. Add product search functionality
10. Create a product detail page

## Submission Guidelines
1. Fork the repository
2. Create a new branch for your work
3. Implement all required features
4. Add proper documentation
5. Create a pull request

## Evaluation Criteria
- Code quality and organization
- Component reusability
- UI/UX design
- Responsive design implementation
- Error handling
- Documentation
- Bonus features implementation
- API integration and data handling

## Resources
- [React Documentation](https://reactjs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Router Documentation](https://reactrouter.com/)
- [FakeStore API Documentation](https://fakestoreapi.com/)

## Support
For any questions or clarifications, please open an issue in the repository.

## License
This project is licensed under the MIT License - see the LICENSE file for details. 
Collapse











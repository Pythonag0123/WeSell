# WeSell E-commerce Project

Welcome to WeSell, a full-stack e-commerce web application. This platform allows users to browse products, place orders, and manage their accounts. It also includes a separate dashboard for sellers/admins to manage products and view orders.


## ✨ Features

* **User Authentication:** Secure user registration and login.
* **Role-Based Access:** Separate routes and permissions for regular users and sellers/admins (`isLoggedIn`, `isSeller` middlewares).
* **Product Management (Admin):** Full CRUD (Create, Read, Update, Delete) functionality for products.
* **Seller Dashboard:** A dedicated view for sellers to manage their listings.
* **Shop Page:** Public-facing page to browse all available products.
* **Order System:** Users can place orders and view their order history.
* **Product Reviews:** Users can leave reviews on products.
* **Image Uploads:** Product images are handled using Multer.

## 💻 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (using Mongoose)
* **View Engine:** EJS (Embedded JavaScript)
* **Authentication:** Session-based (implied by middlewares)
* **File Uploads:** Multer

## 🚀 Getting Started

Follow these instructions to get a local copy up and running for development and testing.

### Prerequisites

You will need the following software installed on your machine:
* [Node.js](https://nodejs.org/) (which includes npm)
* [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas cloud connection string)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Pythonag0123/WeSell.git](https://github.com/Pythonag0123/WeSell.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd WeSell
    ```

3.  **Install NPM packages:**
    ```bash
    npm install
    ```

4.  **Create your Environment File:**
    Create a file named `.env` in the root of the project and add your configuration variables. Your `config/db.js` will need a connection string.

    **.env.example**
    ```env
    MONGO_URI=your_mongodb_connection_string_here
    SESSION_SECRET=a_strong_secret_key_for_sessions
    PORT=3000
    ```

5.  **Run the application:**
    * For development (using nodemon, as you have a `nodemon.json`):
        ```bash
        npm run dev
        ```
    * For production:
        ```bash
        npm start
        ```

6.  Open your browser and visit `http://localhost:3000` (or the port you specified).

## 📁 Project Structure

Here is a brief overview of the project's folder structure:

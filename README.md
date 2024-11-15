
# 📚 Newspaper Web Application 📰

This is a **Newspaper Web Application** built as part of the *PTUDW - Final Project*. The application provides a dynamic and feature-rich platform for managing and reading online news articles, tailored for multiple user roles.

---

## 🚀 Features

### **1. Guest System**
- **Homepage Highlights**:
  - Top 3-4 featured articles of the week.
  - Top 10 most viewed and latest articles.
  - One latest article per top category.
- **Article Browsing**:
  - Filter by categories and tags.
  - Supports pagination.
- **Article Details**:
  - View full content with:
    - Title, thumbnail, category, tags, and comments.
  - Add new comments.
  - Explore random articles from the same category.
- **Full-Text Search**:
  - Search across titles, abstracts, and content.

### **2. Subscriber System**
- Exclusive access to premium articles with **PDF download**.
- Accounts are **time-limited** (7 days by default) and renewable.
- Premium content prioritized in search results and listings.

### **3. Writer System**
- **WYSIWYG Editor**: Create articles with rich text editors like TinyMCE or CKEditor.
- **Manage Articles**:
  - Drafts, pending, published, and rejected articles.
  - Edit drafts or rejected articles.

### **4. Editor System**
- Manage draft articles in assigned categories.
- Approve or reject articles with feedback.
- Schedule publication dates for approved articles.

### **5. Administrator System**
- Manage categories, tags, articles, and users (writers, editors, subscribers).
- Assign categories to editors.
- Extend subscriber accounts.

### **6. General Features**
- **Authentication**:
  - Login using secure, bcrypt-encrypted passwords.
  - Social login via Passport.js (Google, Facebook, etc.).
- **Account Management**:
  - Update profile, reset password with OTP email verification.

---

## 🛠 Technical Stack
- **Framework**: Express.js  
- **Language**: TypeScript  
- **Database**: MongoDB (via Mongoose)  
- **View Engine**: EJS  

---

## 📂 Project Structure

```
├── src
│   ├── controllers      # Handles request/response logic
│   ├── models           # Database schemas (Mongoose)
│   ├── routes           # API endpoints
│   ├── views            # EJS templates
│   ├── utils            # Helper functions
│   └── app.ts           # Entry point of the application
├── public               # Static assets (CSS, JS, images)
├── config               # Configuration files
└── README.md            # Project documentation
```
---

## 🧑‍💻 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) installed.
- MongoDB instance running.

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/nban22/newspaper.git
   cd newspaper
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory with the following:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/newspaper
   SESSION_SECRET=your_secret_key
   ```

4. **Seed Initial Data**:
   Use the provided seed script to populate the database with demo data:
   ```bash
   npm run seed
   ```

5. **Start the Application**:
   ```bash
   npm run dev
   ```

6. **Access the Application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌟 Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a feature branch.
3. Commit your changes with descriptive messages.
4. Open a pull request.

---

## 💡 Acknowledgments
- [Express.js](https://expressjs.com/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [Mongoose](https://mongoosejs.com/)  
- [EJS](https://ejs.co/)  
- [Passport.js](http://www.passportjs.org/)  

---

Feel free to reach out with questions or feedback!

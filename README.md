# 📚 FUTURE-ED

A book-sharing platform where users can browse, upload, and review books.

---

### 1. Download and Extract the Project
- Download this repository as a `.zip` file or clone it with Git.
- Extract it to your preferred folder (e.g., `C:\Projects\FUTURE-ED-site`).

---

### 2. Set Up the Project

#### Open a command prompt and navigate to the project directory:
```bash
cd "path\to\extracted\project"
```
Replace the path with the actual location of the folder.

#### Install root-level dependencies:
```bash
npm install
```

### Navigate to the `backend` folder and install dependencies:
```bash
cd backend
npm install
```

### Navigate to the `frontend` folder and install dependencies:
```bash
cd ../frontend
npm install
```

This will download and install all required packages.
---

### 3. Configure the Environment

Create a `.env` file inside the backend folder with the following content:

```env
SECRET_KEY=your-very-secret-key
```
Replace your-very-secret-key with a secure secret key.

---

### 4. Run the Application

### Return to the root directory (your project directory) if you're not already there:
```bash
cd ..
```

### Start both the frontend and backend servers:
```bash
npm run dev
```

This will simultaneously launch the frontend (localhost:5173) and backend servers.

---

### 5. Open the Website

Go to:

```
http://localhost:5173/
```

🎉 You should now see your website running locally!

---

## 💬 Notes

- New books can be added in the /upload url.
- Ensure `node` and `npm` are installed. You can check with:
  ```bash
  node -v
  npm -v
  ```

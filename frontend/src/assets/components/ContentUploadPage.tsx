import { useState, useEffect } from "react";
import axios from "axios";
import "../css/ContentUploadPage.css"; // <-- make sure to import your CSS file

interface Upload {
  id: number;
  title: string;
  content: string;
  stock: number;
  image_path: string;
}

const ContentUploadPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [stock, setStock] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [uploads, setUploads] = useState<Upload[]>([]);

  useEffect(() => {
    getUploads();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !content || stock <= 0) {
      setMessage("Please fill all fields, select an image, and enter a valid stock.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("stock", stock.toString());
    formData.append("image", file);

    try {
      await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Upload successful!");
      setTitle("");
      setContent("");
      setStock(0);
      setFile(null);
      getUploads();
    } catch (error) {
      setMessage("Upload failed.");
      console.error(error);
    }
  };

  const getUploads = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/items");
      setUploads(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUpload = async (item: Upload) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${item.id}`);
      setUploads((prev) => prev.filter((upload) => upload.id !== item.id));
      setMessage("Deleted successfully!");
    } catch (error) {
      setMessage("Failed to delete.");
      console.error(error);
    }
  };

  return (
    <div className="content-upload-page">
      <h2>Upload Image</h2>
      <form className="content-upload-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(parseInt(e.target.value) || 0)}
          min={1}
          required
        />
        <input type="file" accept="image/*" onChange={handleFileChange} required />
        <button type="submit">Upload</button>
      </form>
      {message && <p className="content-upload-message">{message}</p>}

      <div className="content-upload-uploads">
        <h3>Previous Uploads</h3>
        {uploads.map((upload) => (
          <div key={upload.id} className="content-upload-card">
            <img src={`http://localhost:5000${upload.image_path}`} alt={upload.title} />
            <p>Title: {upload.title}</p>
            <p>Content: {upload.content}</p>
            <p>Stock: {upload.stock}</p>
            <button onClick={() => deleteUpload(upload)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentUploadPage;

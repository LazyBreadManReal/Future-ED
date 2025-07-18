import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../css/AboutUs.css";

function AboutUs() {
    const [name, setName] = useState("");
    const [books, setBooks] = useState([]);
    const scrollRef = useRef(null);

    const [categoryIndex, setCategoryIndex] = useState(0);

    const categories = [
        { image: "src/assets/images/categories/space.jpg", text: "Discover the mysteries of the universe" },
        { image: "src/assets/images/categories/history.jpg", text: "Unravel the past with historical records" },
        { image: "src/assets/images/categories/science.jpg", text: "Explore the world of science and innovation" },
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");

        axios
            .get("http://localhost:5000/api/protected", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setName(res.data.user.name);
            })
            .catch((err) => {
                console.error("Error fetching user:", err);
            });

        // Fetch top books
        axios
            .get("http://localhost:5000/api/items")
            .then((res) => {
                setBooks(res.data); // Assuming the API returns an array of books
            })
            .catch((err) => {
                console.error("Error fetching books:", err);
            });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCategoryIndex((prevIndex) => (prevIndex + 1) % categories.length);
        }, 5000); // Switch every 5 seconds

        return () => clearInterval(interval);
    }, [categories.length]);

    const handleNext = () => {
        setCategoryIndex((prevIndex) => (prevIndex + 1) % categories.length);
    };

    const handlePrev = () => {
        setCategoryIndex((prevIndex) => (prevIndex - 1 + categories.length) % categories.length);
    };

    // Scroll left and right functions
    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

  return (
    <div className="about">
        <div className="upper_page">
            <div className="header">
                <div className="left-header">
                    <nav>
                    <ul>
                        <li>
                        <a href="http://localhost:5173/">Home</a>
                        </li>
                        <li>
                        <a href="http://localhost:5173/about">about</a>
                        </li>
                    </ul>
                    </nav>
                </div>
                <div className="center-header">
                    <img src="src/assets/images/website logo inverted.png" alt="website_logo" />
                </div>
                <div className="right-header">
                    <nav>
                    <ul>
                        <li>
                        <a href="http://localhost:5173/about">About</a>
                        </li>
                        <li>
                        <a href="http://localhost:5173/login">{name ? name : "Account"} </a>
                        </li>
                    </ul>
                    </nav>
                </div>
                <div className="header-gradient" />
            </div>
            <div className="about-web-subtitle">
                <h1>About Us</h1>
            </div>
            <div className="about-main-section">
                <div className="about-main-content">
                    <div className="about-category-section">
                        <p>Welcome to our platform! We're a passionate team dedicated to providing high-quality content and a seamless user experience. Our mission is to make uploading, sharing, and managing content easy and efficient for everyone. Whether you're showcasing your work or managing inventory, we're here to support you every step of the way.</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="about-lower_page">

            <div className="about-footer">
            <div className="about-footer-section">
                <nav>
                <h1>Discover</h1>
                <ul>
                    <li>
                    <a href="#">Home</a>
                    </li>
                    <li>
                    <a href="#">Books</a>
                    </li>
                    <li>
                    <a href="#">Authors</a>
                    </li>
                    <li>
                    <a href="#">Subjects</a>
                    </li>
                    <li>
                    <a href="#">Collections</a>
                    </li>
                    <li>
                    <a href="#">Advanced Search</a>
                    </li>
                </ul>
                </nav>
            </div>
            <div className="about-footer-section">
                <nav>
                <h1>Help</h1>
                <ul>
                    <li>
                    <a href="#">Help Center</a>
                    </li>
                    <li>
                    <a href="#">Contact Us</a>
                    </li>
                    <li>
                    <a href="#">Suggesting Edits</a>
                    </li>
                    <li>
                    <a href="#">Add a Book</a>
                    </li>
                    <li>
                    <a href="#">Release Notes</a>
                    </li>
                </ul>
                </nav>
            </div>
            <div className="about-footer-section">
                <nav>
                <h1>Legal</h1>
                <ul>
                    <li>
                    <a href="#">Terms of service</a>
                    </li>
                    <li>
                    <a href="#">Privacy Policy</a>
                    </li>
                    <li>
                    <a href="#">Cookie Policy</a>
                    </li>
                    <li>
                    <a href="#">Disclaimer</a>
                    </li>
                    <li>
                    <a href="#">DMCA Policy</a>
                    </li>
                </ul>
                </nav>
            </div>
            <div className="about-footer-logo">
                <img src="src/assets/images/website logo inverted.png" alt="website_logo" />
                <div className="about-footer-logo-text">
                <div className="about-footer-logo-title">
                    <h1>FUTURE-ED</h1>
                </div>
                <div className="about-footer-logo-subtitle">
                    <h2>ARCHIVE</h2>
                </div>
                </div>
            </div>
            </div>
            <div className="about-footer-logo-messege">
            <p>© 2025 Future-ED. All rights reserved.</p>
            </div>
        </div>
    </div>
  );
}

export default AboutUs;

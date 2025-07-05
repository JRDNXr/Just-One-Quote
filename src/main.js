import React, { useState, useEffect } from "react";
import { FaMoon, FaSun, FaRedo, FaCopy, FaCheck } from "react-icons/fa";
import './styles/main/main.css';

const Main = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    const [quotes, setQuotes] = useState([]);
    const [randomQuote, setRandomQuote] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [textColorClass, setTextColorClass] = useState("");

    // Extract quote and author from the randomQuote object
    const quoteText = randomQuote?.quote || "";
    const authorName = randomQuote?.author || "";

    // Load quotes from JSON
    useEffect(() => {
        fetch("/quotes.json")
            .then((response) => response.json())
            .then((data) => {
                setQuotes(data);
                setRandomQuote(data[Math.floor(Math.random() * data.length)]);
            })
            .catch((error) => console.error("Error loading quotes:", error));
    }, []);

    // Background color toggle
    useEffect(() => {
        document.documentElement.style.backgroundColor = isDarkMode ? "#141f2c" : "#ecf0f1";
    }, [isDarkMode]);

    const handleClick = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        refreshQuote();
        setTimeout(() => setIsSpinning(false), 1000);
    };

    const refreshQuote = () => {
        if (quotes.length > 0) {
            const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
            setRandomQuote(newQuote);
        }
    };

    const copyToClipboard = () => {
        if (copied || !quoteText) return;

        const fullQuote = authorName ? `${quoteText} - ${authorName}` : quoteText;
        navigator.clipboard.writeText(fullQuote)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => console.error("Failed to copy:", err));
    };

    const toggleDarkMode = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        setTimeout(() => {
            setTextColorClass(isDarkMode ? "light-text" : "dark-text");
        }, 380);

        setTimeout(() => {
            const newMode = !isDarkMode;
            localStorage.setItem("darkMode", newMode);
            setIsDarkMode(newMode);
            setIsAnimating(false);
        }, 1000);
    };

    return (
        <div
            style={{
                color: isDarkMode ? "#ecf0f1" : "#2c3e50",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                fontFamily: "'Arial', sans-serif",
                transition: "all 0.3s ease",
            }}
        >
            {isAnimating && (
                <div className="wipe-overlay" style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: isDarkMode ? "#ecf0f1" : "#141f2c",
                    animation: isDarkMode ? "wipeUp 1s forwards" : "wipeDown 1s forwards",
                    zIndex: 1,
                }}></div>
            )}
            <div style={{ position: "relative", zIndex: 2 }}>
                <h1 className={textColorClass}>{quoteText}</h1>
                {authorName && (
                    <p
                        className={textColorClass}
                        style={{
                            fontStyle: "italic",
                            fontSize: "21px",
                            color: isDarkMode ? "#ecf0f1" : "#2c3e50",
                        }}
                    >
                        - {authorName}
                    </p>
                )}

                {/* Refresh button */}
                <button
                    onClick={handleClick}
                    disabled={isSpinning}
                    style={{
                        position: "fixed",
                        bottom: "180px",
                        right: "20px",
                        padding: "20px",
                        fontSize: "30px",
                        cursor: isSpinning ? "not-allowed" : "pointer",
                        backgroundColor: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "70px",
                        height: "70px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        transition: isSpinning ? "none" : "transform 0.2s ease-in-out",
                        opacity: isSpinning ? 0.5 : 1,
                        pointerEvents: isSpinning ? "none" : "auto",
                        transform: isSpinning ? "scale(1)" : undefined,
                    }}
                    onMouseEnter={(e) => {
                        if (!isSpinning) e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                    }}
                    className={`refresh-button ${isSpinning ? "spinning" : ""}`}
                >
                    <FaRedo color="#000" size={24} className={isSpinning ? "spinning" : ""} />
                    {!isSpinning && <div className="tooltip">Refresh Quote</div>}
                </button>

                {/* Copy button */}
                <button
                    onClick={copyToClipboard}
                    disabled={copied}
                    style={{
                        position: "fixed",
                        bottom: "100px",
                        right: "20px",
                        padding: "20px",
                        fontSize: "30px",
                        cursor: copied ? "not-allowed" : "pointer",
                        backgroundColor: copied ? "#4caf50" : "#fff",
                        border: "none",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "70px",
                        height: "70px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.2s ease-in-out",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    className={copied ? "copied" : ""}
                >
                    {copied ? (
                        <FaCheck
                            color="#fff"
                            size={24}
                            style={{
                                animation: "checkmarkAnim 0.5s ease-out",
                            }}
                        />
                    ) : (
                        <FaCopy color="#000" size={24} />
                    )}
                    <div className="tooltip">Copy Quote</div>
                </button>

                {/* Dark mode button */}
                <button
                    onClick={toggleDarkMode}
                    disabled={isAnimating}
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        padding: "20px",
                        fontSize: "30px",
                        cursor: isAnimating ? "not-allowed" : "pointer",
                        backgroundColor: isDarkMode ? "#fff" : "#000",
                        border: "none",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "70px",
                        height: "70px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.2s ease-in-out",
                        opacity: isAnimating ? 0.5 : 1,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                    {isDarkMode ? (
                        <FaSun color="#000" size={30} style={{ animation: "fadeUp 0.5s forwards" }} />
                    ) : (
                        <FaMoon color="#fff" size={30} style={{ animation: "fadeDown 0.5s forwards" }} />
                    )}
                    <div className="tooltip">
                        {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Main;
import ReactMarkdown from "react-markdown";
import "./MarkdownRenderer.css";

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="markdown-container">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;

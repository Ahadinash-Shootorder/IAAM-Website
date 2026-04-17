"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState, useEffect } from "react";

export default function RichTextEditor({ label, value, onChange }) {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleEditorChange = (content) => {
    onChange(content);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        onInit={(evt, editor) => {
          editorRef.current = editor;
          editor.on("focus", handleFocus);
          editor.on("blur", handleBlur);
        }}
        value={!isFocused ? value : undefined}
        onEditorChange={handleEditorChange}
        init={{
          height: 300,
          menubar: true,
          readonly: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code fullscreen | help",
          content_style: `
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
              font-size: 14px;
            }
          `,
        }}
      />
    </div>
  );
}

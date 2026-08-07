"use client";
import { useState, useRef } from "react";

interface UploadButtonProps {
  onUpload: (url: string) => void;
  label?: string;
}

export default function UploadButton({ onUpload, label = "📤 رفع صورة" }: UploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('❌ يرجى اختيار ملف صورة صالح');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('❌ حجم الصورة كبير جداً (الحد الأقصى 10MB)');
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Image = event.target?.result as string;
      onUpload(base64Image);
      setUploading(false);
    };
    reader.onerror = () => {
      alert('❌ حدث خطأ في قراءة الصورة');
      setUploading(false);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        style={{
          padding: "8px 16px",
          background: uploading ? "#9ca3af" : "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: uploading ? "not-allowed" : "pointer",
          fontSize: "13px",
          fontWeight: "600",
          transition: "all 0.3s",
        }}
        disabled={uploading}
      >
        {uploading ? "⏳ جاري الرفع..." : label}
      </button>
    </div>
  );
}

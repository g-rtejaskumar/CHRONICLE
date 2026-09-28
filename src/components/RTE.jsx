import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";
import conf from "../conf/conf";

export default function RTE({ name, control, label, defaultValue = "" }) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
          {label}
        </label>
      )}
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-md shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)]">
        <Controller
          name={name || "content"}
          control={control}
          rules={{
            required: "Article content is required",
            validate: (val) => {
              const stripped = (val || "").replace(/<[^>]*>/g, "").trim();
              return stripped.length > 0 || "Article content cannot be empty";
            },
          }}
          render={({ field: { onChange, value } }) => (
            <Editor
              apiKey={conf.tinymceApiKey}
              value={value !== undefined ? value : defaultValue}
              init={{
                initialValue: defaultValue,
                height: 480,
                menubar: true,
                skin: "oxide-dark",
                content_css: "dark",
                plugins: [
                  "image",
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
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
                  "undo redo | blocks fontfamily fontsize | bold italic underline forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | removeformat code fullscreen",
                content_style:
                  "body { font-family: Inter, system-ui, -apple-system, sans-serif; font-size: 15px; color: #e2e8f0; background-color: #080a14; line-height: 1.75; padding: 1.2rem; } a { color: #38bdf8; } h1, h2, h3, h4 { color: #ffffff; font-family: Sora, Inter, sans-serif; } blockquote { border-left: 3px solid #8b5cf6; padding-left: 1rem; color: #94a3b8; font-style: italic; } code { background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; color: #f472b6; font-size: 0.9em; }",
              }}
              onEditorChange={onChange}
            />
          )}
        />
      </div>
    </div>
  );
}
"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Locale } from "@/i18n/config";
import { errorText, tx } from "@/i18n/admin";
import { cn } from "@/lib/utils";
import { uploadFile } from "./controls";
import { aBtn, aInput } from "./ui";

function ToolBtn({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-[2px] text-ink/65 transition-colors hover:bg-ink/[0.06] hover:text-ink disabled:opacity-30 [&_svg]:h-[15px] [&_svg]:w-[15px]",
        active && "bg-ink text-white hover:bg-ink hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

const Sep = () => <span className="mx-1 h-5 w-px bg-ink/10" aria-hidden />;

function Toolbar({ editor, locale, dir }: { editor: Editor; locale: Locale; dir: "ltr" | "rtl" }) {
  const t = tx(locale);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [, force] = useState(0);

  // Re-render the toolbar when the selection/marks change.
  useEffect(() => {
    const fn = () => force((n) => n + 1);
    editor.on("transaction", fn);
    return () => {
      editor.off("transaction", fn);
    };
  }, [editor]);

  const openLink = () => {
    setUrl((editor.getAttributes("link").href as string) || "https://");
    setLinkOpen(true);
  };
  const applyLink = () => {
    const v = url.trim();
    if (!v || v === "https://") editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: v }).run();
    setLinkOpen(false);
  };

  const onImage = async (file: File) => {
    setUploading(true);
    const res = await uploadFile(file, "image");
    setUploading(false);
    if (res.ok) editor.chain().focus().setImage({ src: res.url, alt: "" }).run();
    else toast.error(errorText(locale, res.error));
  };

  const start = dir === "rtl" ? "right" : "left";
  const end = dir === "rtl" ? "left" : "right";

  return (
    <div className="sticky top-0 z-10 border-b border-ink/10 bg-white/95 backdrop-blur">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5">
        <ToolBtn label={t("Heading", "عنوان رئيسي")} active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 />
        </ToolBtn>
        <ToolBtn label={t("Subheading", "عنوان فرعي")} active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 />
        </ToolBtn>
        <Sep />
        <ToolBtn label={t("Bold", "عريض")} active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold />
        </ToolBtn>
        <ToolBtn label={t("Italic", "مائل")} active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic />
        </ToolBtn>
        <ToolBtn label={t("Underline", "تسطير")} active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon />
        </ToolBtn>
        <ToolBtn label={t("Strikethrough", "يتوسطه خط")} active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough />
        </ToolBtn>
        <Sep />
        <ToolBtn label={t("Bulleted list", "قائمة نقطية")} active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List />
        </ToolBtn>
        <ToolBtn label={t("Numbered list", "قائمة مرقمة")} active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered />
        </ToolBtn>
        <ToolBtn label={t("Quote", "اقتباس")} active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote />
        </ToolBtn>
        <ToolBtn label={t("Divider", "فاصل")} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus />
        </ToolBtn>
        <Sep />
        <ToolBtn label={t("Align start", "محاذاة للبداية")} active={editor.isActive({ textAlign: start })} onClick={() => editor.chain().focus().setTextAlign(start).run()}>
          {dir === "rtl" ? <AlignRight /> : <AlignLeft />}
        </ToolBtn>
        <ToolBtn label={t("Centre", "توسيط")} active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <AlignCenter />
        </ToolBtn>
        <ToolBtn label={t("Align end", "محاذاة للنهاية")} active={editor.isActive({ textAlign: end })} onClick={() => editor.chain().focus().setTextAlign(end).run()}>
          {dir === "rtl" ? <AlignLeft /> : <AlignRight />}
        </ToolBtn>
        <Sep />
        <ToolBtn label={t("Link", "رابط")} active={editor.isActive("link") || linkOpen} onClick={() => (linkOpen ? setLinkOpen(false) : openLink())}>
          <Link2 />
        </ToolBtn>
        <ToolBtn label={t("Insert image", "إدراج صورة")} disabled={uploading} onClick={() => fileRef.current?.click()}>
          {uploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
        </ToolBtn>
        <span className="ms-auto flex">
          <ToolBtn label={t("Undo", "تراجع")} disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
            <Undo2 className="rtl:-scale-x-100" />
          </ToolBtn>
          <ToolBtn label={t("Redo", "إعادة")} disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
            <Redo2 className="rtl:-scale-x-100" />
          </ToolBtn>
        </span>
      </div>
      {linkOpen && (
        <div className="flex items-center gap-2 border-t border-ink/[0.07] bg-pearl-50 px-3 py-2">
          <input
            autoFocus
            dir="ltr"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyLink();
              }
              if (e.key === "Escape") setLinkOpen(false);
            }}
            placeholder="https://"
            className={cn(aInput, "h-8 flex-1 text-[0.82rem]")}
          />
          <button type="button" onClick={applyLink} className={aBtn("primary", "sm")}>
            {t("Apply", "تطبيق")}
          </button>
          {editor.isActive("link") && (
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().extendMarkRange("link").unsetLink().run();
                setLinkOpen(false);
              }}
              className={aBtn("ghost", "sm", "text-red-700")}
            >
              {t("Remove link", "إزالة الرابط")}
            </button>
          )}
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onImage(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export function RichText({
  value,
  onChange,
  dir,
  locale,
  placeholder,
  minHeight = 360,
}: {
  value: string;
  onChange: (html: string) => void;
  dir: "ltr" | "rtl";
  locale: Locale;
  placeholder?: string;
  minHeight?: number;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, codeBlock: false, code: false }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer" } }),
      Image.configure({ inline: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: placeholder || "" }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        dir,
        class: cn("prose-ah ah-editor max-w-none px-5 py-5 outline-none md:px-7", dir === "rtl" && "font-arabic"),
        style: `min-height:${minHeight}px`,
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.isEmpty ? "" : e.getHTML()),
  });

  return (
    <div className="overflow-hidden rounded-[2px] border border-ink/15 bg-white transition-[border-color,box-shadow] focus-within:border-leaf focus-within:ring-[3px] focus-within:ring-leaf/15">
      {editor ? (
        <>
          <Toolbar editor={editor} locale={locale} dir={dir} />
          <EditorContent editor={editor} />
        </>
      ) : (
        <div className="animate-pulse" style={{ minHeight: minHeight + 44 }}>
          <div className="h-11 border-b border-ink/10 bg-pearl-50" />
        </div>
      )}
    </div>
  );
}

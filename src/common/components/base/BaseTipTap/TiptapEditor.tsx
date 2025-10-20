"use client";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import React, { useEffect } from "react";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditorProvider,
  RichTextField,
  MenuButtonStrikethrough,
  MenuButtonOrderedList,
  MenuButtonBulletedList,
  MenuButtonBlockquote,
  MenuButtonCode,
  MenuButtonHorizontalRule,
  MenuButtonUndo,
  MenuButtonRedo,
  MenuButtonRemoveFormatting,
} from "mui-tiptap";
import "./Tiptap.css";

interface TiptapProps {
  content?: string;
  onChange?: (content: string) => void;
  onUpdate?: (content: string) => void;
  placeholder?: string;
  [key: string]: any;
}

const TiptapEditor: React.FC<TiptapProps> = ({ content = "", onChange, onUpdate, placeholder = "", ...rest }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || "เริ่มพิมพ์...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onUpdate?.(html);
      onChange?.(html);
    },
  });

  // keep editor content in sync when content prop changes
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (content !== current) {
      editor.commands.setContent(content, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, editor]);

  return (
    <RichTextEditorProvider editor={editor}>
      <RichTextField
        controls={
          <MenuControlsContainer>
            <MenuSelectHeading />
            <MenuDivider />
            <MenuButtonBold />
            <MenuButtonItalic />
            <MenuButtonStrikethrough />
            <MenuDivider />
            <MenuButtonOrderedList />
            <MenuButtonBulletedList />
            <MenuDivider />
            <MenuButtonBlockquote />
            <MenuButtonCode />
            <MenuButtonHorizontalRule />
            <MenuDivider />
            <MenuButtonUndo />
            <MenuButtonRedo />
            <MenuDivider />
            <MenuButtonRemoveFormatting />
          </MenuControlsContainer>
        }
        {...rest}
      />
    </RichTextEditorProvider>
  );
};
export default TiptapEditor;

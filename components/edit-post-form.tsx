"use client";
import { useState } from "react";
import Input from "@/components/ui/Input";
import { updatePost } from "@/app/actions";
import LexicalEditor from "@/components/lexical";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { EditorState } from "lexical";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/select";
import { useCallback } from "react";
import {Post, TagsOnPosts, Tag} from "@prisma/client"



interface Category {
  id: string;
  name: string;
}



export default function EditPostForm({
  categories,
  post
}: {
  authorId: string;
  categories: Category[];
post: Post & { tags: TagsOnPosts & {tag: Tag}[]}
}) {
  const [content, setContent] = useState("");
  const handleChange = useCallback((editorState: EditorState) => {
    editorState.read(() => {
      const markdownText = $convertToMarkdownString(TRANSFORMERS);
      setContent(markdownText);
    });
  }, []);

  return (
    <form
      className="gap-6 p-4 flex flex-col"
      action={(formData) => {
        formData.append("content", content);
        formData.append("id", post.id);
        updatePost(formData);
      }}
    >
      <Input id="title" name="title" placeholder="Tiêu đề" defaultValue={post.title} required />

      <LexicalEditor onChange={handleChange} markdown={post.content} />
      <Select defaultValue={post.categoryId} name="categoryId">
        {categories.map((category) => {
          return (
            <option value={category.id} key={category.id}>
              {category.name}
            </option>
          );
        })}
      </Select>
      <Input id="featuredImageURL" name="featuredImageURL" placeholder="Featured image URL" defaultValue={post.featuredImageURL} required />
      <Input id="tags" name="tags" placeholder="Thẻ bài viết" required defaultValue={post.tags.map((i)=>i.tag.name).join(", ")} />
      <Button className="w-full" color="light" type="submit">
        Đăng
      </Button>
    </form>
  );
}
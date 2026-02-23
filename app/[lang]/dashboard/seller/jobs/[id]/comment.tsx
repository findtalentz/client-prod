"use client";
import SharedComment from "@/components/comment/comment";
import CommentSchema from "@/schemas/Comment";

interface Props {
  comment: CommentSchema;
}

export default function Comment({ comment }: Props) {
  return <SharedComment comment={comment} role="seller" variant="active" />;
}

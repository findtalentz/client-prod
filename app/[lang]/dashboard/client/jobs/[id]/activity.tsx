import { CommentOptions, CreateComment } from "@/components/create-activity";
import CommentSchema from "@/schemas/Comment";
import Job from "@/schemas/Job";
import Comment from "./comment";

interface Props {
  job: Job;
  comments: CommentSchema[];
}

const commentTypes: CommentOptions = [
  { value: "COMMENT", label: "Comment" },
  { value: "TIME_REQUEST", label: "Extend Delivery Date" },
];

export function Activity({ job, comments }: Props) {
  return (
    <div className="pb-10 flex flex-col">
      <div className="space-y-10 flex-1 pr-2 relative">
        {comments.length > 0 && (
          <div className="absolute h-[100px] border-l left-4 top-4" />
        )}
        <div className="p-3 relative mx-10 border rounded-xl">
          <div className="absolute w-4 h-4 bg-primary rounded-full top-3 -left-8" />
          <div className="flex items-center gap-4">
            <CreateComment jobId={job._id} options={commentTypes} />
          </div>
        </div>

        {comments.map((comment, index) => (
          <div key={index} className="relative">
            {index < comments.length - 1 && (
              <div className="absolute h-[calc(100%+50px)] border-l left-4 top-4 -z-10" />
            )}
            <Comment comment={comment} />
          </div>
        ))}
      </div>
    </div>
  );
}

Runtime TypeError
Cannot read properties of undefined (reading 'length')
src/components/tasks/detail/comments-section.tsx (127:24) @ CommentBubble


  125 |         </div>
  126 |       )}
> 127 |       {comment.replies.length > 0 && (
      |                        ^
  128 |         <div className="ml-8 mt-2 border-l pl-3 space-y-3">
  129 |           {comment.replies.map((reply) => (
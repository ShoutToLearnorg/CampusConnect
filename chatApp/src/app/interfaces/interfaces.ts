export interface Post {
  _id: string;
  user: string;
  message: string;
  date: string;
  likesCount: number;
  likedBy: string[];
  comments: Comment[];
  commentsCount?: number;
  showComments?: boolean;
  newComment?: string;
}

export interface Comment {
  _id: string;
  author: string;
  content: string;
  date: string;
  replies: Reply[];
  parentId?: string;
  newReply?: string;
  showReplies?: boolean;
  showReplyInput?: boolean;
}

export interface Reply {
  _id: string;
  author: string;
  content: string;
  date: string;
  replies: Reply[];
  showReplies?: boolean;
  newComment?: string;
  originalCommentAuthor?: string;
}

export interface ExtendedReply extends Reply {
  originalCommentAuthor: string;
}

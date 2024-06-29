// reply-item.component.ts

import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { Reply, Post } from '../interfaces/interfaces';

@Component({
  selector: 'app-reply-item',
  templateUrl: './reply-item.component.html',
  styleUrls: ['./reply-item.component.scss'],
})
export class ReplyItemComponent {
  @Input() reply!: Reply;
  @Input() post!: Post;
  @Input() parentCommentId!: string;
  @Input() onReply!: (reply: Reply) => void;

  profilePictures: { [username: string]: Observable<string> } = {};

  constructor(private AuthService: AuthService) {}

  ngOnInit() {
    this.loadProfilePicture(this.reply.author);
    this.loadRepliesProfilePictures(this.reply.replies);
  }

  loadProfilePicture(username: string) {
    if (!this.profilePictures[username]) {
      this.profilePictures[username] = this.AuthService.getProfilePicture(username);
    }
  }

  loadRepliesProfilePictures(replies: Reply[]) {
    replies.forEach(reply => {
      this.loadProfilePicture(reply.author);
      this.loadRepliesProfilePictures(reply.replies);
    });
  }

  toggleReplies() {
    this.reply.showReplies = !this.reply.showReplies;
  }

  replyToReply() {
    this.onReply(this.reply);
  }
}

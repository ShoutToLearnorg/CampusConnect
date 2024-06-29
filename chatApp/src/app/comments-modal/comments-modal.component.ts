import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommunityService } from '../../../services/community.service';
import { Post, Comment, Reply } from '../interfaces/interfaces';

@Component({
  selector: 'app-comments-modal',
  templateUrl: './comments-modal.component.html',
  styleUrls: ['./comments-modal.component.scss'],
})
export class CommentsModalComponent {
  @Input() post: any;
  @Input() profilePictures: any;
  @Input() currentUser: any;
  activeComment: { item: Comment | Reply, path: string[] } | null = null;

  constructor(private modalController: ModalController,
    private communityService: CommunityService,
  ) {}

  dismissModal() {
    this.modalController.dismiss();
  }

  toggleReplies(commentOrReply: Comment | Reply) {
    commentOrReply.showReplies = !commentOrReply.showReplies;
  }

  replyToComment(post: Post, commentOrReply: Comment | Reply, path: string[] = []) {
    this.setActiveComment(commentOrReply, path);
    post.newComment = `@${commentOrReply.author} `;
  }

  setActiveComment(comment: Comment | Reply, path: string[] = []) {
    this.activeComment = { item: comment, path: path.concat(comment._id) };
  }

  async addReplyOrComment() {
    const content = (this.post.newComment || '').trim();
    if (content !== '') {
      if (this.post.activeComment) {
        const path = this.post.activeComment.path;
        await this.communityService.replyToComment(this.post._id, path[path.length - 1], content, this.currentUser.username).toPromise();
      } else {
        await this.communityService.addComment(this.post._id, { content, author: this.currentUser.username }).toPromise();
      }
      this.post.newComment = '';
      this.post.activeComment = null;
      // Optionally reload or update the post's comments
    }
  }
}

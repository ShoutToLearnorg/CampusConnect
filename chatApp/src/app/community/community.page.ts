import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { CommunityService } from '../../../services/community.service';
import { AuthService } from '../../../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Platform, ModalController } from '@ionic/angular';
import { Post, Comment, Reply } from '../interfaces/interfaces';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit, OnDestroy {
  @ViewChild(IonModal) modal!: IonModal;
  userData: any = {};
  posts: Post[] = [];
  newPost: string = '';
  currentUser: any;
  profilePictures: { [username: string]: Observable<string> } = {};
  likedPosts: Set<string> = new Set();
  activeComment: { item: Comment | Reply, path: string[] } | null = null;
  isMobile: boolean;
  isModalOpen = false;
  activePost: Post | null = null;
  isFullyExpanded = false;
  isModalActive = false;
  private routeSub!: Subscription;

  constructor(
    private communityService: CommunityService,
    private authService: AuthService,
    private platform: Platform,
    private http: HttpClient,
    private modalController: ModalController,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.isMobile = this.platform.is('mobile');
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.loadPosts();
        this.loadProfilePicture(user.username);
      }
    });

    this.routeSub = this.route.params.subscribe(params => {
      const username = params['username'];
      if (username) {
        this.fetchUserData(username);
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  async loadPosts() {
    const fetchedPosts = await this.communityService.getPosts().toPromise();
    this.posts = fetchedPosts || [];
    this.posts.forEach(post => {
      post.showComments = false;
      this.loadProfilePicture(post.user);
      post.comments.forEach(comment => {
        this.loadProfilePicture(comment.author);
        comment.replies = comment.replies || [];
        this.initializeReplies(comment.replies);
      });
      if (post.likedBy.includes(this.currentUser.username)) {
        this.likedPosts.add(post._id);
      }
    });
  }

  initializeReplies(replies: Reply[] = []) {
    replies.forEach(reply => {
      this.loadProfilePicture(reply.author);
      reply.showReplies = false;
      reply.replies = reply.replies || [];
      this.initializeReplies(reply.replies);
    });
  }

  getTotalRepliesCount(replies: Reply[] = []): number {
    let count = replies.length;
    replies.forEach(reply => {
      count += this.getTotalRepliesCount(reply.replies);
    });
    return count;
  }

  getTotalCommentsCount(post: Post): number {
    return this.getTotalRepliesCount(post.comments);
  }

  loadProfilePicture(username: string) {
    if (!this.profilePictures[username]) {
      this.profilePictures[username] = this.authService.getProfilePicture(username);
    }
  }

  async createPost() {
    if (this.newPost.trim() !== '') {
      await this.communityService.createPost({ message: this.newPost, user: this.currentUser.username }).toPromise();
      this.newPost = '';
      this.loadPosts();
    }
  }

  isLiked(postId: string): boolean {
    return this.likedPosts.has(postId);
  }

  async toggleLike(post: Post) {
    if (this.likedPosts.has(post._id)) {
      await this.communityService.dislikePost(post._id, this.currentUser.username).toPromise();
      this.likedPosts.delete(post._id);
    } else {
      await this.communityService.likePost(post._id, this.currentUser.username).toPromise();
      this.likedPosts.add(post._id);
    }
    this.loadPosts();
  }

  async addReplyOrComment(post: Post | null) {
    if (!post) return;
  
    const content = (post.newComment || '').trim();
    if (content !== '') {
      let updatedPost: Post | undefined;
      if (this.activeComment) {
        const path = this.activeComment.path;
        updatedPost = await this.communityService.replyToComment(post._id, path[path.length - 1], content, this.currentUser.username).toPromise();
      } else {
        updatedPost = await this.communityService.addComment(post._id, { content, author: this.currentUser.username }).toPromise();
      }
  
      if (updatedPost) {
        // Update the specific post with new comments or replies
        this.posts = this.posts.map(p => p._id === post._id ? updatedPost! : p);
  
        // If modal is active and showing the updated post, update modal content
        if (this.isModalActive && this.activePost && this.activePost._id === post._id) {
          this.activePost = updatedPost;
  
          // Manually dismiss and re-open modal to refresh content
          const modal = await this.modalController.getTop();
          if (modal) {
            await modal.dismiss();
          }
          await this.setOpen(true, updatedPost);
        }
      } else {
        console.error('Failed to update post.'); // Handle error or log it
      }
    }
  
    // Reset active comment and reload posts to reflect changes
    post.newComment = '';
    this.activeComment = null;
    await this.loadPosts();
  }
  
  

  replyToComment(post: Post, commentOrReply: Comment | Reply, path: string[] = []) {
    this.setActiveComment(commentOrReply, path);
    post.newComment = `@${commentOrReply.author}`;
  }

  setActiveComment(comment: Comment | Reply, path: string[] = []) {
    this.activeComment = { item: comment, path: path.concat(comment._id) };
  }

  toggleReplies(commentOrReply: Comment | Reply) {
    commentOrReply.showReplies = !commentOrReply.showReplies;
  }

  toggleComments(post: Post) {
    if (this.isMobile) {
      this.activePost = post;
      this.setOpen(true);
    } else {
      post.showComments = !post.showComments;
    }
  }

  fetchUserData(username: string) {
    this.http.get<any>(`http://localhost:3000/api/users/${username}`).subscribe(
      response => {
        this.userData = response;
      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  async setOpen(isOpen: boolean, post: Post | null = null) {
    this.isModalOpen = isOpen;
    this.isModalActive = isOpen;
    if (!isOpen) {
      const modal = await this.modalController.getTop();
      if (modal) {
        await modal.dismiss();
      }
      this.activePost = null;
    } else {
      this.activePost = post;
    }
  }

  navigateToUserProfile(username: string) {
    this.router.navigate(['/' + username]);
  }
}

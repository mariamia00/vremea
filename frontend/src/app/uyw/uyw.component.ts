import { Component, OnInit } from '@angular/core';
import { POST_LOC_URL, POST_URL } from '../constants/urls';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { CommentsService } from '../services/comments.service';
import { catchError, throwError } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-uyw',
  templateUrl: './uyw.component.html',
  styleUrls: ['./uyw.component.css'],
})
export class UywComponent implements OnInit {
  imageTitle: string = '';
  images: any[] = [];
  postLocation = POST_LOC_URL;
  selectedImage: File | null = null;
  userName: string | null = '';
  userId!: string;
  isCollapsed: boolean = false;
  newComment!: string;
  comments: any[] = [];

  constructor(
    private toastrService: ToastrService,
    private http: HttpClient,
    private userService: UserService,
    private commentService: CommentsService,
    private titleService: Title,
    private meta: Meta
  ) {
    this.titleService.setTitle(
      'Crazy weather uyw, upload your weather, post your weather, weather community'
    );
    this.meta.updateTag({
      name: 'description',
      content:
        'Crazy weather community posts, worldwide weather posts, weather community, post your weather',
    });
    this.meta.updateTag({
      name: 'keywords',
      content:
        'crazy weather forecast, uyw, weather forecast, worldwide weather, heatmap weather, crazy weather, targu jiu weather',
    });
  }

  ngOnInit() {
    const userData = localStorage.getItem('User');
    if (userData) {
      const user = JSON.parse(userData);
      this.userName = user.name;
      this.userId = user.id;
    }
    this.http
      .get<any[]>(POST_URL)
      .pipe(
        catchError((error) => {
          console.error('Failed to fetch images:', error);
          this.toastrService.error(
            'Failed to fetch images. Please try again later.'
          );
          return throwError(error);
        })
      )
      .subscribe((data) => {
        this.images = data;

        for (const post of this.images) {
          this.commentService
            .getCommentsForPost(post._id)
            .subscribe((comments) => {
              post.comments = comments; // Associate comments with the post
            });
        }
      });
  }
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
  onImageSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  uploadImage() {
    if (!this.selectedImage || !this.imageTitle) {
      this.toastrService.error('Please select both image and title');
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedImage);
    formData.append('title', this.imageTitle);

    this.http
      .post(POST_URL, formData)
      .pipe(
        catchError((error) => {
          console.error('Failed to upload post:', error);
          this.toastrService.error(
            'Failed to upload post. Please try again later.'
          );
          return throwError(error);
        })
      )
      .subscribe((response) => {
        this.toastrService.success('Post successfully uploaded');
        this.ngOnInit();
      });
  }
  deletePost(postId: string) {
    if (!confirm('Are you sure you want to delete this post?')) {
      return; // User canceled the deletion
    }

    this.http.delete(`${POST_URL}/${postId}`).subscribe(
      () => {
        console.log('Post deleted successfully');
        this.toastrService.success('Post deleted successfully');
        this.ngOnInit();
      },
      (error) => {
        console.error('Error deleting post:', error);
        this.toastrService.error('Failed to delete post');
      }
    );
  }

  // comments methods
  createComment(postId: string) {
    if (!this.newComment) {
      this.toastrService.error('Please enter a comment');
      return;
    }

    this.commentService.addComment(postId, this.newComment).subscribe(
      (response) => {
        this.toastrService.success('Comment added successfully');
        this.newComment = '';
        this.ngOnInit(); // Refresh comments after adding a new one
      },
      (error) => {
        console.log(error);
        this.toastrService.error('Failed to add comment');
      }
    );
  }

  deleteComment(commentId: string) {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return; // User canceled the deletion
    }

    this.commentService.deleteComment(commentId).subscribe(
      () => {
        console.log('Comment deleted successfully');
        this.toastrService.success('Comment deleted successfully');
        this.ngOnInit(); // Refresh comments after deleting one
      },
      (error) => {
        console.error('Error deleting comment:', error);
        this.toastrService.error('Failed to delete comment');
      }
    );
  }
}

package com.sstm888labs.restexample.springmvc.test;

import com.sstm888labs.restexample.springmvc.domain.Post;
import com.sstm888labs.restexample.springmvc.model.PostForm;

/**
 *
 * @author sstm888
 */
public final class Fixtures {
	
	private Fixtures() {
	      throw new InstantiationError( "Must not instantiate this class" );
	}

    public static Post createPost(String title, String content) {
        Post post = new Post();
        post.setTitle(title);
        post.setContent(content);

        return post;
    }

    public static PostForm createPostForm(String title, String content) {
        PostForm post = new PostForm();
        post.setTitle(title);
        post.setContent(content);

        return post;
    }

}

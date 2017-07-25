package com.sstm888labs.restexample.springmvc.test;

import com.sstm888labs.restexample.springmvc.config.AppConfig;
import com.sstm888labs.restexample.springmvc.config.DataJpaConfig;
import com.sstm888labs.restexample.springmvc.config.DataSourceConfig;
import com.sstm888labs.restexample.springmvc.config.JpaConfig;
import com.sstm888labs.restexample.springmvc.domain.Post;
import com.sstm888labs.restexample.springmvc.exception.ResourceNotFoundException;
import com.sstm888labs.restexample.springmvc.model.PostDetails;
import com.sstm888labs.restexample.springmvc.model.PostForm;
import com.sstm888labs.restexample.springmvc.repository.PostRepository;
import com.sstm888labs.restexample.springmvc.service.BlogService;
import java.util.Objects;
import javax.inject.Inject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {AppConfig.class, DataSourceConfig.class, DataJpaConfig.class, JpaConfig.class})
public class BlogServiceTest {

    private static final Logger LOG = LoggerFactory.getLogger(BlogServiceTest.class);

    @Inject
    private PostRepository postRepository;

    @Inject
    private BlogService blogService;

    private Post post;

    public BlogServiceTest() {
    }

    @Before
    public void setUp() {
        postRepository.deleteAll();
        post = postRepository.save(Fixtures.createPost("My first post", "content of my first post"));

        assertNotNull(post.getId());
    }

    @After
    public void tearDown() {
    }

    @Test
    public void testSavePost() {
        PostForm form = new PostForm();
        form.setTitle("saving title");
        form.setContent("saving content");

        PostDetails details = blogService.savePost(form);

        LOG.debug("post details @" + details);
        assertNotNull("saved post id should not be null@", details.getId());
        assertNotNull(details.getId());

        Page<PostDetails> allPosts = blogService.searchPostsByCriteria("", null, new PageRequest(0, 10));
        assertTrue(allPosts.getTotalElements() == 2);

        Page<PostDetails> posts = blogService.searchPostsByCriteria("first", Post.Status.DRAFT, new PageRequest(0, 10));
        assertTrue(posts.getTotalPages() == 1);
        assertTrue(!posts.getContent().isEmpty());
        assertTrue(Objects.equals(posts.getContent().get(0).getId(), post.getId()));

        PostForm updatingForm = new PostForm();
        updatingForm.setTitle("updating title");
        updatingForm.setContent("updating content");
        PostDetails updatedDetails = blogService.updatePost(post.getId(), updatingForm);

        assertNotNull(updatedDetails.getId());
        assertTrue("updating title".equals(updatedDetails.getTitle()));
        assertTrue("updating content".equals(updatedDetails.getContent()));

    }

    @Test(expected = ResourceNotFoundException.class)
    public void testGetNoneExistingPost() {
        blogService.findPostById(1000L);
    }

}

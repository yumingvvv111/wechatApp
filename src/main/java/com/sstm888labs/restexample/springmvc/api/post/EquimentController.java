package com.sstm888labs.restexample.springmvc.api.post;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sstm888labs.restexample.springmvc.Constants;
import com.sstm888labs.restexample.springmvc.domain.MyPage;
import com.sstm888labs.restexample.springmvc.domain.MyPageImp;
import com.sstm888labs.restexample.springmvc.domain.Post;
import com.sstm888labs.restexample.springmvc.exception.InvalidRequestException;
import com.sstm888labs.restexample.springmvc.model.*;
import com.sstm888labs.restexample.springmvc.service.BlogService;
import com.sstm888labs.restexample.springmvc.service.EquipmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import javax.inject.Inject;
import javax.validation.Valid;

@RestController
@RequestMapping(value = Constants.URI_REST + Constants.URI_EQUIPMENT)
public class EquimentController {

    private static final Logger log = LoggerFactory
            .getLogger(EquimentController.class);

    private EquipmentService equipmentService;
    private BlogService blogService;

    @Inject
    public EquimentController(EquipmentService equipmentService, BlogService blogService) {

        this.equipmentService = equipmentService;
        this.blogService = blogService;

    }


    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/position", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<MyPage<Map>> position(
            @RequestParam(value = "wxId", required = false) String wxId) {

        Map<String, Object> map = new HashMap<>();
        MyPage<Map> page = new MyPageImp<>(map);

        return new ResponseEntity<>(page, HttpStatus.OK);
    }


    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/getEquimentDetailData", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<MyPage<Map>> getEquimentDetailData(
            @RequestParam(value = "wxId", required = false) String wxId,
            @PageableDefault(page = 0, size = 30, sort = "time", direction = Direction.DESC) Pageable page) {


        Map<String, Object> map = new HashMap<>();
        MyPage<Map> result = equipmentService.searchChartDetails(page);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/getEquimentData", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<MyPage<Map>> getEquimentData(
            @RequestParam(value = "wxId", required = false) String wxId) {


        Map<String, Object> map = new HashMap<>();
        JSONObject object = JSON.parseObject("{\n" +
                "      \"position\": \"厕所\",\n" +
                "      \"ch2\": \"27\",\n" +
                "      \"pollutionLevel\": \"27\",\n" +
                "      \"tvoc\": \"27\",\n" +
                "      \"wxId\": null,\n" +
                "      \"humity\": \"27\",\n" +
                "      \"pm25\": \"27\",\n" +
                "      \"temperature\": \"27\", \"uploadTime\": 1498533444547\n" +
                "    }");
        map.put("equimentData", object);
        MyPage<Map> page = new MyPageImp<>(map);

        return new ResponseEntity<>(page, HttpStatus.OK);
    }


    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/unbind", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<MyPage<Map>> unbind(
            @RequestParam(value = "wxId", required = false) String wxId, //
            @RequestParam(value = "bindType", required = false) String bindType) {

        log.debug("get unbind type of type@" + bindType);

        Map<String, Object> map = new HashMap<>();
        MyPage<Map> page = new MyPageImp<>(map);

        return new ResponseEntity<>(page, HttpStatus.OK);
    }


    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/list", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<MyPage<Map>> getEquimentList(
            @RequestParam(value = "q", required = false) String keyword, //
            @RequestParam(value = "status", required = false) Post.Status status, //
            @PageableDefault(page = 0, size = 10, sort = "roomName", direction = Direction.DESC) Pageable page) {

        log.debug("get all equipment list of q@" + keyword + ", status @" + status + ", page@" + page);

        MyPage<Map> posts = equipmentService.searchPostsByCriteria(keyword, page);

//        log.debug("get posts size @" + posts.getTotalElements());

        return new ResponseEntity<>(posts, HttpStatus.OK);
    }


    @CrossOrigin(origins = "*")
    @RequestMapping(value = "", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Page<PostDetails>> getAllPosts(
            @RequestParam(value = "q", required = false) String keyword, //
            @RequestParam(value = "status", required = false) Post.Status status, //
            @PageableDefault(page = 0, size = 10, sort = "title", direction = Direction.DESC) Pageable page) {

        log.debug("get all posts of q@" + keyword + ", status @" + status + ", page@" + page);

        Page<PostDetails> posts = blogService.searchPostsByCriteria(keyword, status, page);

        log.debug("get posts size @" + posts.getTotalElements());

        return new ResponseEntity<>(posts, HttpStatus.OK);
    }


    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<PostDetails> getPost(@PathVariable("id") Long id) {

        log.debug("get postsinfo by id @" + id);

        PostDetails post = blogService.findPostById(id);

        log.debug("get post @" + post);

        return new ResponseEntity<>(post, HttpStatus.OK);
    }


    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/{id}/comments", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Page<CommentDetails>> getCommentsOfPost(
            @PathVariable("id") Long id,
            @PageableDefault(page = 0, size = 10, sort = "createdDate", direction = Direction.DESC) Pageable page) {

        log.debug("get comments of post@" + id + ", page@" + page);

        Page<CommentDetails> commentsOfPost = blogService.findCommentsByPostId(id, page);

        log.debug("get post comment size @" + commentsOfPost.getTotalElements());

        return new ResponseEntity<>(commentsOfPost, HttpStatus.OK);
    }


    @CrossOrigin(origins = "*")
    @RequestMapping(value = "", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<ResponseMessage> createPost(@RequestBody @Valid PostForm post, BindingResult errResult) {

        log.debug("create a new post");
        if (errResult.hasErrors()) {
            throw new InvalidRequestException(errResult);
        }

        PostDetails saved = blogService.savePost(post);

        log.debug("saved post id is @" + saved.getId());

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(ServletUriComponentsBuilder.fromCurrentContextPath()
                .path(Constants.URI_API + Constants.URI_POSTS + "/{id}")
                .buildAndExpand(saved.getId())
                .toUri()
        );
        return new ResponseEntity<>(ResponseMessage.success("post.created"), headers, HttpStatus.CREATED);
    }


    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<ResponseMessage> deletePostById(@PathVariable("id") Long id) {

        log.debug("delete post by id @" + id);

        blogService.deletePostById(id);

        return new ResponseEntity<>(ResponseMessage.success("post.updated"), HttpStatus.NO_CONTENT);
    }

    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/{id}/comments", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<ResponseMessage> createCommentOfPost(
            @PathVariable("id") Long id, @RequestBody CommentForm comment) {

        log.debug("new comment of post@" + id + ", comment" + comment);

        CommentDetails saved = blogService.saveCommentOfPost(id, comment);

        log.debug("saved comment @" + saved.getId());

        return new ResponseEntity<>(ResponseMessage.success("comment.created"), HttpStatus.CREATED);
    }

}

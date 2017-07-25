package com.sstm888labs.restexample.springmvc.service;

import java.io.ByteArrayInputStream;
import java.io.ObjectInput;
import java.util.*;

import com.sstm888labs.restexample.springmvc.DTOUtils;
import com.sstm888labs.restexample.springmvc.domain.*;
import com.sstm888labs.restexample.springmvc.exception.ResourceNotFoundException;
import com.sstm888labs.restexample.springmvc.model.*;
import com.sstm888labs.restexample.springmvc.repository.CommentRepository;
import com.sstm888labs.restexample.springmvc.repository.EquipmentRepository;
import com.sstm888labs.restexample.springmvc.repository.EquipmentSpecifications;
import com.sstm888labs.restexample.springmvc.repository.EquipmentDataRepository;
import com.sstm888labs.restexample.springmvc.repository.PostSpecifications;
import org.aspectj.apache.bcel.util.ClassLoaderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import javax.inject.Inject;

/**
 * @author Yuming Zhang<sstm888@gmail.com>
 */
@Service
@Transactional
public class EquipmentService {

    private static final Logger log = LoggerFactory.getLogger(EquipmentService.class);

    private EquipmentRepository equipmentRepository;

    private CommentRepository commentRepository;

    private EquipmentDataRepository equipmentDataRepository;

    @Inject
    public EquipmentService(EquipmentRepository equipmentRepository, CommentRepository commentRepository, EquipmentDataRepository equipmentDataRepository) {
        this.equipmentRepository = equipmentRepository;
        this.commentRepository = commentRepository;
        this.equipmentDataRepository = equipmentDataRepository;
    }

    public MyPage<List> getEquipmentList(String q, Pageable page) {

        log.debug("search posts by keyword@" + q + ", page @" + page);

        Page<Equipment> posts = equipmentRepository.findAll(EquipmentSpecifications.filterByKeywordAndStatus(q),
                page);

        log.debug("get posts size @" + posts.getTotalElements());

        return DTOUtils.mapList(posts, EquipmentListDetails.class);
    }

    public MyPage<Map> searchChartDetails(Pageable page) {

        Map<String, Object> resultMap = new HashMap<>();

        Map<String, List> subMap = new HashMap<>();

        List l1 = new ArrayList<>();
        subMap.put("ch2", l1);

        List l2 = new ArrayList<>();
        subMap.put("pm25", l2);

        List l3 = new ArrayList<>();
        subMap.put("pollutionLevel", l3);

        List l4 = new ArrayList<>();
        subMap.put("tvoc", l4);

        List l5 = new ArrayList<>();
        subMap.put("humity", l5);

        List l6 = new ArrayList<>();
        subMap.put("temperature", l6);

//        Page<EquipmentData> map = equipmentDataRepository.findAll(EquipmentSpecifications.filterByKeyword(q), page);
        List<EquipmentData> map = equipmentDataRepository.findByCharacter(page);


        List<EquipmentDataDetails> convertList = DTOUtils.myMapList(map, EquipmentDataDetails.class);


//        log.debug("list@" + list);
        convertList.forEach(r -> {

            Float ch2 = r.getCh2();
            Float humity = r.getHumity();
            Float pm25 = r.getPm25();
            Float pollutionLevel = r.getPollutionLevel();
            Float temperature = r.getTemperature();
            Float tvoc = r.getTvoc();

            String time = r.getTime();

            Map<String, Object> m1 = new HashMap();
            m1.put("time", time);
            m1.put("value", ch2);
            l1.add(m1);

            Map<String, Object> m2 = new HashMap();
            m2.put("time", time);
            m2.put("value", humity);
            l5.add(m2);

            Map<String, Object> m3 = new HashMap();
            m3.put("time", time);
            m3.put("value", pm25);
            l2.add(m3);

            Map<String, Object> m4 = new HashMap();
            m4.put("time", time);
            m4.put("value", pollutionLevel);
            l3.add(m4);

            Map<String, Object> m5 = new HashMap();
            m5.put("time", time);
            m5.put("value", temperature);
            l6.add(m5);


            Map<String, Object> m6 = new HashMap();
            m6.put("time", time);
            m6.put("value", tvoc);
            l4.add(m6);


        });

        resultMap.put("equimentDetailData", subMap);

        return new MyPageImp<>(resultMap);
    }


    public MyPage<Map> searchPostsByCriteria(String q, Pageable page) {

        log.debug("search posts by keyword@" + q + ", page @" + page);

        Page<Equipment> posts = equipmentRepository.findAll(EquipmentSpecifications.filterByKeywordAndStatus(q),
                page);

        log.debug("get posts size @" + posts.getTotalElements());

        return DTOUtils.mapList(posts, EquipmentListDetails.class);
    }

    public PostDetails savePost(PostForm form) {

        log.debug("save post @" + form);

        Equipment post = DTOUtils.map(form, Equipment.class);

        Equipment saved = equipmentRepository.save(post);

        log.debug("saved post is @" + saved);

        return DTOUtils.map(saved, PostDetails.class);

    }

    public PostDetails updatePost(Long id, PostForm form) {
        Assert.notNull(id, "post id can not be null");

        log.debug("update post @" + form);

        Equipment post = equipmentRepository.findOne(id);
        DTOUtils.mapTo(form, post);

        Equipment saved = equipmentRepository.save(post);

        log.debug("updated post@" + saved);

        return DTOUtils.map(saved, PostDetails.class);
    }

    public PostDetails findPostById(Long id) {

        Assert.notNull(id, "post id can not be null");

        log.debug("find post by id@" + id);

        Equipment post = equipmentRepository.findOne(id);

        if (post == null) {
            throw new ResourceNotFoundException(id);
        }

        return DTOUtils.map(post, PostDetails.class);
    }

    public Page<CommentDetails> findCommentsByPostId(Long id, Pageable page) {

        log.debug("find comments by post id@" + id);

        Page<Comment> comments = commentRepository.findByPostId(id, page);

        log.debug("found results@" + comments.getTotalElements());

        return DTOUtils.mapPage(comments, CommentDetails.class);
    }

    public CommentDetails saveCommentOfPost(Long id, CommentForm fm) {
        Assert.notNull(id, "post id can not be null");

        log.debug("find post by id@" + id);

        Equipment post = equipmentRepository.findOne(id);

        if (post == null) {
            throw new ResourceNotFoundException(id);
        }

        Comment comment = DTOUtils.map(fm, Comment.class);

//        comment.setPost(post);

        comment = commentRepository.save(comment);

        log.debug("comment saved@" + comment);

        return DTOUtils.map(comment, CommentDetails.class);
    }

    public boolean deletePostById(Long id) {
        Assert.notNull(id, "post id can not be null");

        log.debug("find post by id@" + id);

        Equipment post = equipmentRepository.findOne(id);

        if (post == null) {
            throw new ResourceNotFoundException(id);
        }

        equipmentRepository.delete(post);

        return true;
    }

    public void deleteCommentById(Long id) {
        Assert.notNull(id, "comment id can not be null");

        log.debug("delete comment by id@" + id);

        Comment comment = commentRepository.findOne(id);

        if (comment == null) {
            throw new ResourceNotFoundException(id);
        }

        commentRepository.delete(comment);
    }
}

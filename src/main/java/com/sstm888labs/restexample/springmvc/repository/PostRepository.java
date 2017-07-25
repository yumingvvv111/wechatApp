package com.sstm888labs.restexample.springmvc.repository;

import com.sstm888labs.restexample.springmvc.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PostRepository extends JpaRepository<Post, Long>,//
        JpaSpecificationExecutor<Post>{

}

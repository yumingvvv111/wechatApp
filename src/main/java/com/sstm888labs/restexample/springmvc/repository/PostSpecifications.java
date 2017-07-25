package com.sstm888labs.restexample.springmvc.repository;

import com.sstm888labs.restexample.springmvc.domain.Post;
import com.sstm888labs.restexample.springmvc.domain.Post_;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

/**
 *
 * @author Yuming Zhang<sstm888@gmail.com>
 *
 */
public final class PostSpecifications {
	
	private PostSpecifications() {
	      throw new InstantiationError( "Must not instantiate this class" );
	}

    public static Specification<Post> filterByKeywordAndStatus(
            final String keyword,//
            final Post.Status status) {
        return (Root<Post> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (StringUtils.hasText(keyword)) {
                predicates.add(
                        cb.or(
                                cb.like(root.get(Post_.title), "%" + keyword + "%"),
                                cb.like(root.get(Post_.content), "%" + keyword + "%")
                        )
                );
            }

            if (status != null) {
                predicates.add(cb.equal(root.get(Post_.status), status));
            }

            return cb.and(predicates.toArray(new Predicate[predicates.size()]));
        };
    }

}
